import React from 'react'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import RefreshIcon from '@material-ui/icons/Refresh'
import withChatty from '../context/chatty/withChatty'

class RefreshButton extends React.Component {
    render() {
        return (
            <Tooltip disableFocusListener title='Refresh Thread Order' enterDelay={350}>
                <IconButton onClick={this.props.refreshChatty}>
                    <RefreshIcon/>
                </IconButton>
            </Tooltip>
        )
    }
}

export default withChatty(RefreshButton)
