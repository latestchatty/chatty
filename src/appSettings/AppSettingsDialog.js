import React, {useContext, useState} from 'react'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import Dialog from '@material-ui/core/Dialog'
import Button from '@material-ui/core/Button'
import FilterContext from '../context/filter/FilterContext'
import Typography from '@material-ui/core/Typography'
import FilterCheckbox from '../filter/FilterCheckbox'
import {makeStyles} from '@material-ui/styles'
import IndicatorContext from '../context/indicators/IndicatorContext'

function AppSettingsDialog({open, onClose}) {
    const classes = useStyles()
    //const {filterSettings, updateFilterSettings} = useContext(FilterContext)
    const {setLoading} = useContext(IndicatorContext)
    //const [showCollapsed, setShowCollapsed] = useState(filterSettings.showCollapsed)

    const handleSave = async () => {
        try {
            setLoading('sync')
            //await updateFilterSettings({showCollapsed, filteredTerms, filteredUsers})
            onClose()
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Application Settings</DialogTitle>
            <DialogContent className={classes.content}>
                <div className={classes.checkboxes}>
                    <FilterCheckbox
                        label='Show Mobile Friendly UI'
                        checked={true}
                        // onChange={() => setShowCollapsed(!showCollapsed)}
                    />
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSave}>Save</Button>
            </DialogActions>
        </Dialog>
    )
}

const useStyles = makeStyles({
    content: {
        display: 'flex',
        flexDirection: 'column',
        width: 300
    },
    checkboxes: {
        marginTop: 12
    }
})

export default AppSettingsDialog
