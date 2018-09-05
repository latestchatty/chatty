import React from 'react'
import MessagesContext from './MessagesContext'
import fetchJson from '../../util/fetchJson'
import withAuth from '../auth/withAuth'

class MessagesProvider extends React.PureComponent {
    state = {
        totalMessagesCount: null,
        unreadMessagesCount: null
    }

    async componentDidMount() {
        this.mounted = true

        // initial value
        this.getCounts()

        // update counts every 15 minutes
        this.interval = setInterval(() => this.getCounts(), 15 * 60 * 1000)
    }

    componentWillUnmount() {
        this.mounted = false

        clearInterval(this.interval)
    }

    async getCounts() {
        const {username, password} = this.props
        const {total, unread} = await fetchJson('getMessageCount', {method: 'POST', body: {username, password}})
        this.mounted && this.setState({totalMessagesCount: total, unreadMessagesCount: unread})
    }

    render() {
        const contextValue = {
            ...this.state
        }

        return (
            <MessagesContext.Provider value={contextValue}>
                {this.props.children}
            </MessagesContext.Provider>
        )
    }
}

export default withAuth(
    MessagesProvider
)
