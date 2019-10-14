import React from 'react'
import Tooltip from '@material-ui/core/Tooltip'
import format from 'date-fns/format'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import parseISO from 'date-fns/parseISO'
import {makeStyles} from '@material-ui/styles'

function PostDate({date}) {
    const classes = useStyles()
    const parsed = parseISO(date)
    return (
        <Tooltip disableFocusListener title={format(parsed, 'MMM dd, yyyy h:mma')} enterDelay={350}>
            <div className={classes.date}>{formatDistanceToNow(parsed)} ago</div>
        </Tooltip>
    )
}

const useStyles = makeStyles({
    date: {
        fontSize: 10,
        color: '#888',
        paddingTop: 3,
        marginRight: 3
    }
})

export default PostDate
