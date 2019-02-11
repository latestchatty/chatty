import React from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
import {makeStyles} from '@material-ui/styles'

function SyncLoadingIndicator({loading}) {
    const classes = useStyles()
    if (loading !== 'sync') return null
    return (
        <div className={classes.container}>
            <CircularProgress
                className={classes.progress}
                size={60}
                thickness={4}
                color='secondary'
            />
        </div>
    )
}

const useStyles = makeStyles({
    container: {
        zIndex: 99999,
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.2)'
    },
    progress: {
        position: 'absolute',
        top: 'calc(50% - 60px)',
        left: 'calc(50% - 60px)'
    }
})

export default SyncLoadingIndicator
