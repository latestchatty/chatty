import React from 'react'
import LinearProgress from '@material-ui/core/LinearProgress'
import {makeStyles} from '@material-ui/styles'

function AsyncLoadingIndicator({loading}) {
    const classes = useStyles()
    if (loading !== 'async') return null
    return <LinearProgress className={classes.progress} color='secondary'/>
}

const useStyles = makeStyles({
    progress: {
        zIndex: 9999,
        position: 'fixed',
        top: 0,
        width: '100vw'
    }
})

export default AsyncLoadingIndicator
