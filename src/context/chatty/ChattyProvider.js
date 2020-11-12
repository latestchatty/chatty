import React, {useCallback, useContext, useEffect, useMemo, useRef, useState} from 'react'
import ChattyContext from './ChattyContext'
import fetchJson from '../../util/fetchJson'
import AuthContext from '../auth/AuthContext'
import IndicatorContext from '../indicators/IndicatorContext'
import subHours from 'date-fns/subHours'
import isBefore from 'date-fns/isBefore'
import parseISO from 'date-fns/parseISO'

function ChattyProvider({children}) {
    const {isLoggedIn, username} = useContext(AuthContext)
    const {setLoading, showSnackbar} = useContext(IndicatorContext)
    const chattyRef = useRef({
        lastUsername: username,
        threads: [],
        newThreads: []
    })
    const [chattyValue, setChattyValue] = useState(chattyRef.current)
    const [lastEventId, setLastEventId] = useState(0)

    const getMarkedPosts = useCallback(async () => {
        if (isLoggedIn) {
            const {markedPosts} = await fetchJson(`clientData/getMarkedPosts?username=${encodeURIComponent(username)}`)
            return markedPosts
        }
        return []
    }, [isLoggedIn, username])

    const updateThreads = useCallback(async (freshThreads = false, freshMarkedPosts = false, includeNewThreads = false) => {
        // fresh chatty load from server
        let {threads: nextThreads} = freshThreads ? await getChatty() : {}

        // process marked posts if needed
        const markedPosts = freshMarkedPosts ? await getMarkedPosts() : null

        // compile new thread state
        nextThreads = nextThreads || chattyRef.current.threads

        // only add in new threads when needed
        nextThreads = includeNewThreads ? chattyRef.current.newThreads.concat(nextThreads) : nextThreads
        const nextNewThreads = includeNewThreads ? [] : chattyRef.current.newThreads

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
            const parsed = parseISO(post.date)
            return isBefore(expireDate, parsed)
        })

        // sort by activity, pinned first
        nextThreads = nextThreads
            .sort((a, b) => maxPostIdByThread[b.threadId] - maxPostIdByThread[a.threadId])
            .sort((a, b) => a.markType === 'pinned' ? -1 : (b.markType === 'pinned' ? 1 : 0))

        // update state to trigger render
        chattyRef.current.threads = nextThreads
        chattyRef.current.newThreads = nextNewThreads

        // clean up any old posts after loading, doesn't impact state
        if (markedPosts) {
            let ids = markedPosts
                .filter(post => !maxPostIdByThread[post.id])
                .map(({id}) => id)
            if (ids.length) {
                try {
                    ids.reduce(async (acc, id) => {
                        await acc
                        return fetchJson('clientData/markPost', {
                            method: 'POST',
                            body: {username, postId: id, type: 'unmarked'}
                        })
                    }, Promise.resolve())
                } catch (ex) {
                    console.error('Error unmarking old posts.', ex)
                }
            }
        }

        setChattyValue({...chattyRef.current})
    }, [getMarkedPosts, username])

    const getChatty = async threadCount => {
        return await fetchJson(`getChatty${threadCount > 0 ? `?count=${threadCount}` : ''}`)
    }

    const handleEvent = (event = {}) => {
        const {eventType, eventData} = event

        if (eventType === 'newPost') {
            const {post} = eventData
            if (post.parentId) {
                const addReply = thread => {
                    if (thread.threadId === post.threadId) {
                        const found = thread.posts.find(p => p.id === post.id)
                        if (!found) {
                            return {
                                ...thread,
                                posts: [
                                    ...thread.posts,
                                    post
                                ]
                            }
                        }
                    }
                    return thread
                }

                chattyRef.current.threads = chattyRef.current.threads.map(addReply)
                chattyRef.current.newThreads = chattyRef.current.newThreads.map(addReply)
            } else {
                const found = chattyRef.current.threads.find(t => t.threadId === post.id) ||
                    chattyRef.current.newThreads.find(t => t.threadId === post.id)
                if (!found) {
                    chattyRef.current.newThreads = [
                        ...chattyRef.current.newThreads,
                        {
                            threadId: post.id,
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

            chattyRef.current.threads = chattyRef.current.threads.map(updateCategory)
            chattyRef.current.newThreads = chattyRef.current.newThreads.map(updateCategory)
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

            chattyRef.current.threads = chattyRef.current.threads.map(updateTags)
            chattyRef.current.newThreads = chattyRef.current.newThreads.map(updateTags)
        } else {
            console.debug('Unhandled event type:', event)
        }
    }

    // full load of chatty on start and when required
    useEffect(() => {
        const fullReload = async () => {
            try {
                setLoading('async')

                const {eventId} = await fetchJson('getNewestEventId')
                await updateThreads(true, true, false)
                setLastEventId(eventId)
            } catch (ex) {
                showSnackbar('Error loading chatty. Content may not be current.', {variant: 'error'})
                console.error('Exception while doing full reload.', ex)
                setTimeout(() => fullReload(), 30000)
            } finally {
                setLoading(false)
            }
        }
        if (lastEventId === 0) fullReload()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lastEventId])

    // wait for and handle events
    useEffect(() => {
        let mounted = true
        const waitForEvent = async () => {
            if (mounted && lastEventId) {
                try {
                    const {lastEventId: newerEventId, events, error} = await fetchJson(`waitForEvent?lastEventId=${lastEventId}`)

                    if (mounted) {
                        if (!error) {
                            if (newerEventId > lastEventId) {
                                events.forEach(event => handleEvent(event))
                                setLastEventId(newerEventId)
                                setChattyValue({...chattyRef.current})
                            } else {
                                // No changes
                                return waitForEvent(lastEventId)
                            }
                        } else {
                            console.error('Error from API:waitForLastEvent call.', error)
                            showSnackbar('Error receiving events. Reloading full chatty.', {variant: 'error'})
                            setLastEventId(0)
                        }
                    }
                } catch (ex) {
                    showSnackbar('Error receiving events. Reloading full chatty.', {variant: 'error'})
                    console.error('Exception from API:waitForLastEvent call.', ex)
                    setLastEventId(0)
                }
            }
        }

        waitForEvent(lastEventId)
        return () => mounted = false
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lastEventId])

    // reload things when logged in user changes
    useEffect(() => {
        const refreshForNewUser = async () => {
            chattyRef.current.lastUsername = username

            try {
                setLoading('async')
                setChattyValue({threads: [], newThreads: []})
                await updateThreads(true, true, true)
            } finally {
                setLoading(false)
            }
        }

        if (username !== chattyRef.current.lastUsername) {
            refreshForNewUser()
        }
    }, [username, setLoading, updateThreads])

    const refreshChatty = useCallback(() => updateThreads(false, false, true), [updateThreads])

    const contextValue = useMemo(() => ({
        ...chattyValue,
        refreshChatty
    }), [chattyValue, refreshChatty])

    return (
        <ChattyContext.Provider value={contextValue}>
            {children}
        </ChattyContext.Provider>
    )
}

export default ChattyProvider
