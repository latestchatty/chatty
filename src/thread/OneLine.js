import React from 'react'
import PostAuthor from './PostAuthor'
import {withStyles} from '@material-ui/core/styles'
import classnames from 'classnames'

class OneLine extends React.PureComponent {
    state = {
        oneline: ''
    }

    getSnippet(body) {
        const stripped = body.replace(/(<(?!span)(?!\/span)[^>]+>| tabindex="1")/gm, ' ')
        return this.htmlSnippet(stripped, 106)
    }

    htmlSnippet(input, maxLength) {
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

    componentDidMount() {
        const {post} = this.props
        const {body} = post
        const oneline = this.getSnippet(body)
        this.setState({oneline})
    }

    handleClick = () => {
        const {post, onExpandReply} = this.props
        onExpandReply(post.id)
    }

    render() {
        const {classes, post, thread} = this.props
        const {oneline} = this.state
        const lineClass = `oneline${post.recentReplyNumber || 9}`

        return (
            <div className={classes.container}>
                <span
                    className={classnames(classes.oneline, classes[lineClass])}
                    dangerouslySetInnerHTML={{__html: oneline}}
                    onClick={this.handleClick}
                />
                <span className={classes.separator}>:</span>
                <PostAuthor post={post} thread={thread}/>
            </div>
        )
    }
}

const styles = {
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
}

export default withStyles(styles)(OneLine)
