import React from 'react'
import ChattyContext from './ChattyContext'
import fetchJson from '../../util/fetchJson'
import withIndicators from '../indicators/withIndicators'

class ChattyProvider extends React.PureComponent {
    state = {
        posts: {},
        threads: [],
        newThreads: []
    }

    componentDidMount() {
        return this.startActive()
    }

    async startActive() {
        let {threads} = await this.getChatty()
        this.setState({threads})
    }

    async getChatty(threadCount) {
        const {setLoading} = this.props
        try {
            setLoading('async')
            return await fetchJson(`getChatty${threadCount > 0 ? `?count=${threadCount}` : ''}`)
        } finally {
            setLoading(false)
        }
    }

    async waitForEvent(lastEventId) {
        return await fetchJson(`waitForEvent?lastEventId=${lastEventId}`)
    }

    render() {
        const contextValue = {
            ...this.state
        }

        return (
            <ChattyContext.Provider value={contextValue}>
                {this.props.children}
            </ChattyContext.Provider>
        )
    }
}

export default withIndicators(ChattyProvider)
