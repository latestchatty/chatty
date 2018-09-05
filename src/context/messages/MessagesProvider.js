import React from 'react'
import MessagesContext from './MessagesContext'
import fetchJson from '../../util/fetchJson'
import withAuth from '../auth/withAuth'

class MessagesProvider extends React.PureComponent {
    state = {
        totalMessagesCount: 0,
        unreadMessagesCount: 0
    }

    async componentDidMount() {
        this.mounted = true
        await this.getCounts()
    }

    componentWillUnmount() {
        this.mounted = false
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
