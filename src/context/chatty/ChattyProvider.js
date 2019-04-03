import React, {useContext, useEffect, useState} from 'react'
import ChattyContext from './ChattyContext'
import fetchJson from '../../util/fetchJson'
import AuthContext from '../auth/AuthContext'
import IndicatorContext from '../indicators/IndicatorContext'
import subHours from 'date-fns/sub_hours'
import isBefore from 'date-fns/is_before'

function ChattyProvider({children}) {
    let mounted = true
    const {isLoggedIn, username} = useContext(AuthContext)
    const {setLoading, showSnackbar} = useContext(IndicatorContext)

    const [chatty, setChatty] = useState({threads: [], newThreads: []})

    const [events, setEvents] = useState([])
    const [lastEventId, setLastEventId] = useState(null)

    const updateThreads = async (freshThreads = false, freshMarkedPosts = false, includeNewThreads = false) => {
        // fresh chatty load from server
        let {threads: nextThreads} = freshThreads ? await getChatty() : {}

        // process marked posts if needed
        let markedPosts
        if (freshMarkedPosts) markedPosts = await getMarkedPosts(freshMarkedPosts)

        // compile new thread state
        nextThreads = nextThreads || chatty.threads

        // only add in new threads when needed
        nextThreads = includeNewThreads ? chatty.newThreads.concat(nextThreads) : nextThreads
        let nextNewThreads = includeNewThreads ? [] : chatty.newThreads

        // if we're loading marked posts, process the data
        if (markedPosts) {
            const markedPostsById = markedPosts
                .reduce((acc, post) => ({
                    ...acc,
                    [post.id]: post.type
                }), {})

            // update post markings
            nextThreads = nextThreads
                .map(thread => ({
                    ...thread,
                    markType: markedPostsById[thread.threadId] || 'unmarked'
                }))
        }

        // order by recent activity
        let maxPostIdByThread = nextThreads
            .reduce((acc, thread) => {
                acc[thread.threadId] = thread.posts.reduce((acc, post) => Math.max(post.id, acc), 0)
                return acc
            }, {})

        // remove expired threads
        const expireDate = subHours(Date.now(), 18)
        nextThreads = nextThreads.filter(thread => {
            const threadId = +thread.threadId
            const post = thread.posts.find(post => post.id === threadId)
            return isBefore(expireDate, post.date)
        })

        // sort by activity, pinned first
        nextThreads = nextThreads
            .sort((a, b) => maxPostIdByThread[b.threadId] - maxPostIdByThread[a.threadId])
            .sort((a, b) => a.markType === b.markType === 'pinned' || a.markType === b.markType !== 'pinned' ? 0 : a.markType === 'pinned' ? -1 : 1)

        // update state to trigger render
        setChatty({
            threads: nextThreads,
            newThreads: nextNewThreads
        })

        // clean up any old posts after loading, doesn't impact state
        if (markedPosts) {
            let ids = markedPosts
                .filter(post => !maxPostIdByThread[post.id])
                .map(({id}) => id)
            if (ids.length) {
                try {
                    await fetchJson('clientData/markPost', {
                        method: 'POST',
                        body: {username, postId: ids.join(','), type: 'unmarked'}
                    })
                } catch (ex) {
                    console.error('Error unmarking old posts.', ex)
                }
            }
        }
    }

    const fullReload = async () => {
        try {
            setLoading('async')

            const {eventId} = await fetchJson('getNewestEventId')
            await updateThreads(true, true, false)
            setLastEventId(eventId)
        } catch (ex) {
            showSnackbar('Error loading chatty. Content may not be current.')
            console.error('Exception while doing full reload.', ex)
            setLastEventId(0)
            setTimeout(() => fullReload(), 30000)
        } finally {
            setLoading(false)

        }
    }

    const waitForEvent = async () => {
        if (mounted && lastEventId) {
            try {
                const {lastEventId: newerEventId, events, error} = await fetchJson(`waitForEvent?lastEventId=${lastEventId}`)

                if (mounted) {
                    if (!error) {
                        setEvents(events)
                        setLastEventId(newerEventId)
                    } else {
                        console.error('Error from API:waitForLastEvent call.', error)
                        showSnackbar('Error receiving events. Reloading full chatty.')
                        return fullReload()
                    }
                }
            } catch (ex) {
                showSnackbar('Error receiving events. Reloading full chatty.')
                console.error('Exception from API:waitForLastEvent call.', ex)
                setLastEventId(0)
                return fullReload()
            }
        }
    }

    const getMarkedPosts = async () => {
        if (isLoggedIn) {
            const {markedPosts} = await fetchJson(`clientData/getMarkedPosts?username=${encodeURIComponent(username)}`)
            return markedPosts
        }
        return []
    }

    const getChatty = async threadCount => {
        return await fetchJson(`getChatty${threadCount > 0 ? `?count=${threadCount}` : ''}`)
    }

    const handleEvent = (event = {}, current) => {
        const {eventType, eventData} = event

        if (eventType === 'newPost') {
            const {post} = eventData
            if (post.parentId) {
                const threadId = `${post.threadId}`
                const addReply = thread => {
                    if (thread.threadId === threadId) {
                        return {
                            ...thread,
                            posts: [
                                ...thread.posts,
                                post
                            ]
                        }
                    }
                    return thread
                }

                return {
                    threads: current.threads.map(addReply),
                    newThreads: current.newThreads.map(addReply)
                }
            } else {
                return {
                    threads: current.threads,
                    newThreads: [
                        ...current.newThreads,
                        {
                            threadId: `${post.id}`,
                            posts: [
                                post
                            ]
                        }
                    ]
                }
            }
        } else if (eventType === 'categoryChange') {
            const {postId, category} = eventData
            const updateCategory = thread => {
                const threadContainsUpdate = thread.posts.find(post => post.id === postId)
                if (threadContainsUpdate) {
                    const posts = thread.posts
                        .map(post => {
                            if (post.id === postId) {
                                return {...post, category}
                            }
                            return post
                        })
                    return {...thread, posts}
                }
                return thread
            }

            return {
                threads: current.threads.map(updateCategory),
                newThreads: current.newThreads.map(updateCategory)
            }
        } else if (eventType === 'lolCountsUpdate') {
            const {updates} = eventData
            const updatedPostsById = updates
                .reduce(((acc, {postId, tag, count}) => ({
                    ...acc,
                    [postId]: {tag, count}
                })), {})
            const updateTags = thread => {
                const threadContainsUpdate = thread.posts.find(post => updatedPostsById[post.id])
                if (threadContainsUpdate) {
                    const posts = thread.posts
                        .map(post => {
                            const updated = updatedPostsById[post.id]
                            if (updated) {
                                const lols = (post.lols || [])
                                    .filter(tag => tag.tag !== updated.tag)
                                    .concat([updated])
                                return {...post, lols}
                            }
                            return post
                        })
                    return {...thread, posts}
                }
                return thread
            }

            return {
                threads: current.threads.map(updateTags),
                newThreads: current.newThreads.map(updateTags)
            }
        } else {
            console.debug('Unhandled event type:', event)
        }
    }

    const refreshChatty = async () => {
        await updateThreads(false, false, true)
        window.scrollTo(0, 0)
    }

    // full load of chatty on start
    useEffect(() => {
        fullReload()
        return () => mounted = false
    }, [isLoggedIn])

    // wait for events
    useEffect(() => {
        waitForEvent(lastEventId)
    }, [lastEventId])

    // handle events
    useEffect(() => {
        const newChatty = events.reduce((current, event) => handleEvent(event, current), chatty)
        setChatty(newChatty)
    }, [events])

    const contextValue = {
        ...chatty,
        refreshChatty
    }

    return (
        <ChattyContext.Provider value={contextValue}>
            {children}
        </ChattyContext.Provider>
    )
}

export default ChattyProvider
