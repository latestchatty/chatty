import React, {useMemo} from 'react'
import PostAuthor from './PostAuthor'
import classnames from 'classnames'
import Tags from './Tags'
import {makeStyles} from '@material-ui/styles'

function OneLine({post, thread, onExpandReply}) {
    const classes = useStyles()
    const getSnippet = body => {
        const input = body.replace(/(<(?!span)(?!\/span)[^>]+>| tabindex="1")/gm, ' ')
        const maxLength = 106

        let i = 0
        let len = 0
        let tag = false
        let char = false
        while (i < input.length && len < maxLength) {
            if (input[i] === '<') {
                tag = true
            } else if (input[i] === '>') {
                tag = false
            } else if (input[i] === '&') {
                char = true
            } else if (input[i] === '' && char) {
                char = false
                len++
            } else if (!tag) {
                len++
            }

            i++
        }

        let output = input.slice(0, i).trim()
        if (i < input.length || !output) {
            output += '...'
        }

        return output
    }

    const lineClass = `oneline${post.recentReplyNumber || 9}`
    const oneline = useMemo(() => getSnippet(post.body), [post.body])

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
