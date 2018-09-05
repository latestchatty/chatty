import React from 'react'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import MessageIcon from '@material-ui/icons/Message'
import Badge from '@material-ui/core/Badge'
import {withStyles} from '@material-ui/core/styles'
import withAuth from '../context/auth/withAuth'
import fetchJson from '../util/fetchJson'

class MessagesButton extends React.Component {
    state = {
        totalMessagesCount: 0,
        unreadMessagesCount: 0
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
        const {classes, isLoggedIn} = this.props
        const {totalMessagesCount, unreadMessagesCount} = this.state
        const displayBadge = unreadMessagesCount > 0
        const title = `( ${unreadMessagesCount} / ${totalMessagesCount} ) unread messages`
        if (!isLoggedIn) return null

        return (
            <Tooltip disableFocusListener title={title} enterDelay={350}>
                <IconButton href='https://www.shacknews.com/messages' target='_blank'>
                    {
                        displayBadge
                            ? <Badge
                                badgeContent={unreadMessagesCount}
                                color='secondary'
                                classes={{badge: classes.badge}}
                            >
                                <MessageIcon/>
                            </Badge>
                            : <MessageIcon/>
                    }
                </IconButton>
            </Tooltip>
        )
    }
}

const styles = {
    badge: {
        top: 12
    }
}

export default withAuth(
    withStyles(styles)(
        MessagesButton
    )
)
