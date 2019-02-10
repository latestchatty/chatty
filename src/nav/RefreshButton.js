import React, {useContext} from 'react'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import RefreshIcon from '@material-ui/icons/Refresh'
import Badge from '@material-ui/core/Badge'
import {withStyles} from '@material-ui/core/styles'
import ChattyContext from '../context/chatty/ChattyContext'

function RefreshButton({classes}) {
    const {newThreads, refreshChatty} = useContext(ChattyContext)
    const displayBadge = newThreads && newThreads.length > 0
    const title = displayBadge ? `Refresh Thread Order (${newThreads.length} new threads)` : 'Refresh Thread Order'

    return (
        <Tooltip disableFocusListener title={title} enterDelay={350}>
            <IconButton onClick={refreshChatty}>
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

const styles = {
    badge: {
        top: 12
    }
}

export default withStyles(styles)(RefreshButton)
