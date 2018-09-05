import React from 'react'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import MessageIcon from '@material-ui/icons/Message'
import Badge from '@material-ui/core/Badge'
import {withStyles} from '@material-ui/core/styles'
import withMessages from '../context/messages/withMessages'
import withAuth from '../context/auth/withAuth'

class MessagesButton extends React.Component {
    render() {
        const {classes, isLoggedIn, totalMessagesCount = 0, unreadMessagesCount = 0} = this.props
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
    withMessages(
        withStyles(styles)(
            MessagesButton
        )
    )
)
