import React from 'react'
import Tooltip from '@material-ui/core/Tooltip'
import format from 'date-fns/format'
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now'
import {withStyles} from '@material-ui/core/styles'

function PostDate({classes, date}) {
    return (
        <Tooltip disableFocusListener title={format(date, 'MMM DD, YYYY h:mma')} enterDelay={350}>
            <div className={classes.date}>{distanceInWordsToNow(date)} ago</div>
        </Tooltip>
    )
}

const styles = {
    date: {
        fontSize: 10,
        color: '#888',
        paddingTop: 3,
        marginRight: 3
    }
}

export default withStyles(styles)(PostDate)
