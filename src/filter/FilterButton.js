import React from 'react'
import IconButton from '@material-ui/core/IconButton/IconButton'
import FilterListIcon from '@material-ui/icons/FilterList'
import Tooltip from '@material-ui/core/Tooltip/Tooltip'
import FilterDialog from './FilterDialog'

class FilterButton extends React.Component {
    state = {open: false}

    handleClick = () => this.setState({open: true})
    handleClose = () => this.setState({open: false})

    render() {
        const {open} = this.state
        return (
            <React.Fragment>
                <Tooltip disableFocusListener title='Filter Threads/Posts' enterDelay={350}>
                    <IconButton onClick={this.handleClick}>
                        <FilterListIcon/>
                    </IconButton>
                </Tooltip>

                <FilterDialog open={open} onClose={this.handleClose}/>
            </React.Fragment>
        )
    }
}

export default FilterButton
