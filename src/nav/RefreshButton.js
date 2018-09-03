import React from 'react'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import RefreshIcon from '@material-ui/icons/Refresh'
import Badge from '@material-ui/core/Badge'
import withChatty from '../context/chatty/withChatty'
import {withStyles} from '@material-ui/core/styles'

class RefreshButton extends React.Component {
    render() {
        const {classes, newThreads} = this.props
        const displayBadge = newThreads && newThreads.length > 0
        const title = displayBadge ? `Refresh Thread Order (${newThreads.length} new threads)` : 'Refresh Thread Order'
        return (
            <Tooltip disableFocusListener title={title} enterDelay={350}>
                <IconButton onClick={this.props.refreshChatty}>
                    {
                        displayBadge ?
                            <Badge badgeContent={newThreads.length} color='secondary' classes={{badge: classes.badge}}>
                                <RefreshIcon/>
                            </Badge>
                            : <RefreshIcon/>
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

export default withChatty(
    withStyles(styles)(
        RefreshButton
    )
)
