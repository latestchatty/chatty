import React from 'react'
import ChattyContext from './ChattyContext'
import fetchJson from '../../util/fetchJson'
import withIndicators from '../indicators/withIndicators'

class ChattyProvider extends React.PureComponent {
    state = {
        threads: []
    }

    componentDidMount() {
        return this.startActive()
    }

    async startActive() {
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
        if (!this.waiting) {
            const {lastEventId: newerEventId, events, error} = await fetchJson(`waitForEvent?lastEventId=${lastEventId}`)

            if (!error) {
                events.forEach(event => this.handleEvent(event))

                return this.waitForEvent(newerEventId)
            } else {
                // TODO: handle eventing error
            }
        }
    }

    async handleEvent(event = {}) {
        const {eventType, eventData} = event

        if (eventType === 'newPost') {
            const {post} = eventData
            if (post.parentId) {
                const threadId = `${post.threadId}`
                this.setState(oldState => ({
                    threads: oldState.threads.map(thread => {
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
                    })
                }))
            } else {
                this.setState(oldState => ({
                    threads: {
                        ...oldState.threads,
                        post
                    }
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
            console.log('TODO: event lol updates', event)
            // TODO: handle lol tags in general honestly
        } else {
            console.log('Unhandled event type:', event)
        }
    }

    render() {
        const contextValue = {...this.state}

        return (
            <ChattyContext.Provider value={contextValue}>
                {this.props.children}
            </ChattyContext.Provider>
        )
    }
}

export default withIndicators(ChattyProvider)
