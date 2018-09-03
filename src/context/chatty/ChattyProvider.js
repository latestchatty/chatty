import React from 'react'
import ChattyContext from './ChattyContext'
import fetchJson from '../../util/fetchJson'
import withIndicators from '../indicators/withIndicators'

class ChattyProvider extends React.PureComponent {
    state = {
        threads: [],
        newThreads: []
    }

    componentDidMount() {
        this.mounted = true
        return this.fullReload()
    }

    componentWillUnmount() {
        this.mounted = false
    }

    async fullReload() {
        const {setLoading} = this.props
        try {
            setLoading('async')

            const {eventId} = await fetchJson('getNewestEventId')
            const {threads} = await this.getChatty()

            this.setState({threads})

            this.waitForEvent(eventId)
        } finally {
            setLoading(false)
        }
    }

    async getChatty(threadCount) {
        return await fetchJson(`getChatty${threadCount > 0 ? `?count=${threadCount}` : ''}`)
    }

    async waitForEvent(lastEventId) {
        if (this.mounted) {
            const {lastEventId: newerEventId, events, error} = await fetchJson(`waitForEvent?lastEventId=${lastEventId}`)

            if (this.mounted) {
                if (!error) {
                    events.forEach(event => this.handleEvent(event))

                    return this.waitForEvent(newerEventId)
                } else {
                    // TODO: handle eventing error
                    console.log('Error from API:waitForLastEvent call.', error)
                }
            }
        }
    }

    async handleEvent(event = {}) {
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
                this.setState(oldState => ({
                    threads: oldState.threads.map(addReply),
                    newThreads: oldState.newThreads.map(addReply)
                }))
            } else {
                this.setState(oldState => ({
                    newThreads: [
                        ...oldState.newThreads,
                        {
                            threadId: `${post.id}`,
                            posts: [
                                post
                            ]
                        }
                    ]
                }))
            }
        } else if (eventType === 'categoryChange') {
            console.log('TODO: event categoryChange', event)
            // if (category === 'nuked') {
            //     // TODO: Handle nuked post
            //     console.log('TODO: Nuked post', event)
            // } else {
            //     // TODO: Handle category change
            //     console.log('TODO: Category change', event)
            // }
        } else if (eventType === 'lolCountsUpdate') {
            console.debug('TODO: event lol updates', event)
            // TODO: handle lol tags in general honestly
        } else {
            console.debug('Unhandled event type:', event)
        }
    }

    refreshChatty = () => {
        this.setState(oldState => {
            const maxPostIdByThread = oldState.threads
                .reduce((acc, thread) => {
                    acc[thread.threadId] = thread.posts.reduce((acc, post) => Math.max(post.id, acc), 0)
                    return acc
                }, {})
            const threads = oldState.newThreads
                .concat(oldState.threads.sort((a, b) => maxPostIdByThread[b.threadId] - maxPostIdByThread[a.threadId]))
            window.scrollTo(0, 0)
            return {newThreads: [], threads}
        })
    }

    render() {
        const contextValue = {
            ...this.state,
            refreshChatty: this.refreshChatty
        }

        return (
            <ChattyContext.Provider value={contextValue}>
                {this.props.children}
            </ChattyContext.Provider>
        )
    }
}

export default withIndicators(ChattyProvider)
