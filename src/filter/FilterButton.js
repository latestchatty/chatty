import React, {useState} from 'react'
import IconButton from '@material-ui/core/IconButton/IconButton'
import FilterListIcon from '@material-ui/icons/FilterList'
import Tooltip from '@material-ui/core/Tooltip/Tooltip'
import FilterDialog from './FilterDialog'

function FilterButton() {
    const [open, setOpen] = useState(false)
    return (
        <React.Fragment>
            <Tooltip disableFocusListener title='Filter Threads/Posts' enterDelay={350}>
                <IconButton onClick={() => setOpen(true)}>
                    <FilterListIcon/>
                </IconButton>
            </Tooltip>

            <FilterDialog open={open} onClose={() => setOpen(false)}/>
        </React.Fragment>
    )
}

export default FilterButton
