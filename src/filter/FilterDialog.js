import React, {useContext, useState} from 'react'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import Dialog from '@material-ui/core/Dialog'
import Button from '@material-ui/core/Button'
import FilterContext from '../context/filter/FilterContext'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import {withStyles} from '@material-ui/core/styles'

function FilterDialog({classes, open, onClose}) {
    const {filterSettings, updateFilterSettings} = useContext(FilterContext)
    const [showCollapsed, setShowCollapsed] = useState(filterSettings.showCollapsed)

    const handleSave = () => {
        onClose()
        updateFilterSettings({
            showCollapsed
        })
    }

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Filter Threads/Posts</DialogTitle>
            <DialogContent className={classes.content}>
                <FormControlLabel
                    label='Show Collapsed Threads'
                    control={
                        <Checkbox
                            checked={showCollapsed}
                            onChange={() => setShowCollapsed(!showCollapsed)}
                            value='showCollapsed'
                        />
                    }
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSave}>Save</Button>
            </DialogActions>
        </Dialog>
    )
}

const styles = {
    content: {
        display: 'flex',
        flexDirection: 'column'
    }
}

export default withStyles(styles)(FilterDialog)
