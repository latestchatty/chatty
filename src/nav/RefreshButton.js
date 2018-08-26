import React from 'react'
import IconButton from '@material-ui/core/IconButton'
import RefreshIcon from '@material-ui/icons/Refresh'

class RefreshButton extends React.Component {
    handleClick = () => console.log('TODO: Refresh/reflow threads')

    render() {
        return (
            <IconButton disabled onClick={this.handleClick}>
                <RefreshIcon/>
            </IconButton>
        )
    }
}

export default RefreshButton
