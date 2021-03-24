import React, {useContext, useMemo} from 'react'
import PostAuthor from './PostAuthor'
import classnames from 'classnames'
import Tags from '../tags/Tags'
import {makeStyles} from '@material-ui/styles'
import {getSnippet} from '../util/bodyUtils'
import FilterContext from '../context/filter/FilterContext'

function OneLine({post, thread, onExpandReply}) {
    const classes = useStyles()
    const {isPostVisible} = useContext(FilterContext)

    const lineClass = `oneline${post.recentReplyNumber || 9}`
    const oneline = useMemo(() => getSnippet(post.body), [post.body])

    const visible = useMemo(() => isPostVisible(thread, post), [isPostVisible, post, thread])
    if (!visible) return null
    return (
        <div className={classes.container}>
            <span
                className={classnames(classes.oneline, classes[lineClass])}
                dangerouslySetInnerHTML={{__html: oneline}}
                onClick={() => onExpandReply(post.id)}
            />
            <Tags tags={post.lols} variant='oneline'/>
            <PostAuthor post={post} thread={thread}/>
        </div>
    )
}

const useStyles = makeStyles({
    container: {
        display: 'flex',
        flexDirection: 'row'
    },
    separator: {
        padding: '0 3px',
        fontSize: 11,
        color: '#fff'
    },
    oneline: {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        '&:hover': {
            color: '#fff',
            backgroundColor: '#233548',
            cursor: 'pointer'
        }
    },
    oneline10: {
        color: '#777'
    },
    oneline9: {
        color: '#888'
    },
    oneline8: {
        color: '#999'
    },
    oneline7: {
        color: '#aaa'
    },
    oneline6: {
        color: '#bbb'
    },
    oneline5: {
        color: '#ccc'
    },
    oneline4: {
        color: '#ddd'
    },
    oneline3: {
        color: '#eee'
    },
    oneline2: {
        color: '#fff'
    },
    oneline1: {
        color: '#eee',
        fontWeight: 'bold'
    }
})

export default OneLine
