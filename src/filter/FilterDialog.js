import React, {useContext, useState} from 'react'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import Dialog from '@material-ui/core/Dialog'
import Button from '@material-ui/core/Button'
import FilterContext from '../context/filter/FilterContext'
import Typography from '@material-ui/core/Typography'
import EditableList from './EditableList'
import FilterCheckbox from './FilterCheckbox'
import {makeStyles} from '@material-ui/styles'
import IndicatorContext from '../context/indicators/IndicatorContext'

function FilterDialog({open, onClose}) {
    const classes = useStyles()
    const {filterSettings, updateFilterSettings} = useContext(FilterContext)
    const {setLoading} = useContext(IndicatorContext)
    const [showCollapsed, setShowCollapsed] = useState(filterSettings.showCollapsed)
    const [showFilteredTerms, setShowFilteredTerms] = useState(filterSettings.showFilteredTerms)
    const [showFilteredUsers, setShowFilteredUsers] = useState(filterSettings.showFilteredUsers)
    const [showNotWorkSafePosts, setShowNotWorkSafePosts] = useState(filterSettings.showNotWorkSafePosts)
    const [showStupidPosts, setShowStupidPosts] = useState(filterSettings.showStupidPosts)
    const [showOfftopicPosts, setShowOfftopicPosts] = useState(filterSettings.showOfftopicPosts)
    const [showPoliticalReligiousPosts, setShowPoliticalReligiousPosts] = useState(filterSettings.showPoliticalReligiousPosts)
    const [showCortexPosts, setShowCortexPosts] = useState(filterSettings.showCortexPosts)
    const [filteredTerms, setFilteredTerms] = useState(filterSettings.filteredTerms)
    const [filteredUsers, setFilteredUsers] = useState(filterSettings.filteredUsers)

    const handleSave = async () => {
        try {
            setLoading('sync')
            await updateFilterSettings({
                showCollapsed,
                showFilteredTerms,
                showFilteredUsers,
                showNotWorkSafePosts,
                showStupidPosts,
                showOfftopicPosts,
                showPoliticalReligiousPosts,
                showCortexPosts,
                filteredTerms,
                filteredUsers
            })
            onClose()
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Filter Settings</DialogTitle>
            <DialogContent className={classes.content}>
                <Typography variant='caption' color='textSecondary'>
                    These settings adjust what posts display in the chatty. Filtered keywords will hide any
                    posts that match. Filtered users will hide any posts or replies by that user. Terms support full
                    regular expressions. Checking a checkbox will show posts even if they match that criteria.
                </Typography>

                <EditableList title='Term' value={filteredTerms} onChange={value => setFilteredTerms(value)}/>
                <EditableList title='User' value={filteredUsers} onChange={value => setFilteredUsers(value)}/>

                <div className={classes.checkboxes}>
                    <FilterCheckbox
                        label='Show Not Work Safe Posts'
                        checked={showNotWorkSafePosts}
                        onChange={() => setShowNotWorkSafePosts(!showNotWorkSafePosts)}
                    />
                    <FilterCheckbox
                        label='Show Stupid Posts'
                        checked={showStupidPosts}
                        onChange={() => setShowStupidPosts(!showStupidPosts)}
                    />
                    <FilterCheckbox
                        label='Show Offtopic Posts'
                        checked={showOfftopicPosts}
                        onChange={() => setShowOfftopicPosts(!showOfftopicPosts)}
                    />
                    <FilterCheckbox
                        label='Show Political / Religious Posts'
                        checked={showPoliticalReligiousPosts}
                        onChange={() => setShowPoliticalReligiousPosts(!showPoliticalReligiousPosts)}
                    />
                    <FilterCheckbox
                        label='Show Cortex Posts'
                        checked={showCortexPosts}
                        onChange={() => setShowCortexPosts(!showCortexPosts)}
                    />
                </div>

                <div className={classes.checkboxes}>
                    <FilterCheckbox
                        label='Show Collapsed Threads/Posts'
                        checked={showCollapsed}
                        onChange={() => setShowCollapsed(!showCollapsed)}
                    />
                    <FilterCheckbox
                        label='Show Filtered Terms'
                        checked={showFilteredTerms}
                        onChange={() => setShowFilteredTerms(!showFilteredTerms)}
                    />
                    <FilterCheckbox
                        label='Show Filtered Users'
                        checked={showFilteredUsers}
                        onChange={() => setShowFilteredUsers(!showFilteredUsers)}
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

export default FilterDialog
