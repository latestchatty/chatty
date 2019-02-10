import React from 'react'
import LinearProgress from '@material-ui/core/LinearProgress'
import {withStyles} from '@material-ui/core/styles'

function AsyncLoadingIndicator({classes, loading}) {
    if (loading !== 'async') return null
    return <LinearProgress className={classes.progress} color='secondary'/>
}

const styles = {
    progress: {
        zIndex: 9999,
        position: 'fixed',
        top: 0,
        width: '100vw'
    }
}

export default withStyles(styles)(AsyncLoadingIndicator)
