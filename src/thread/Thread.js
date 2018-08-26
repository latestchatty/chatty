import React from 'react'
import Post from './Post'
import {find, sortBy, keyBy} from 'lodash'
import Comments from './Comments'
import {withStyles} from '@material-ui/core/styles'

class Thread extends React.PureComponent {
    state = {
        thread: {},
        collapsed: false,
        replies: [],
        expandedReplyId: null,
        replyBoxOpenForId: null
    }

    componentDidMount() {
        const {thread: rawThread} = this.props

        const posts = sortBy(rawThread.posts, 'id')
        const postsById = keyBy(posts, 'id')

        const thread = find(posts, {parentId: 0})
        posts.forEach(post => {
            post.thread = thread
            if (post.parentId) {
                const parent = postsById[post.parentId]
                parent.posts = parent.posts || []
                parent.posts.push(post)
            }
        })
        posts.slice(-10).reverse().forEach((post, index) => post.recentReplyNumber = index + 1)
        const replies = posts.filter(post => post.parentId === thread.id)

        this.setState({thread, replies})
    }

    handleCollapseReply = () => this.setState({expandedReplyId: null, replyBoxOpenForId: null})
    handleExpandReply = expandedReplyId => this.setState({expandedReplyId, replyBoxOpenForId: null})
    handleCollapse = () => this.setState({collapsed: true, replyBoxOpenForId: null})
    handleOpenReplyBox = id => this.setState({replyBoxOpenForId: id})
    handleCloseReplyBox = () => this.setState({replyBoxOpenForId: null})

    render() {
        const {classes} = this.props
        const {collapsed, thread, replies, expandedReplyId, replyBoxOpenForId} = this.state
        if (collapsed) return null

        return (
            <div className={classes.thread}>
                <Post
                    post={thread}
                    replyBoxOpenForId={replyBoxOpenForId}
                    onCollapse={this.handleCollapse}
                    onOpenReplyBox={this.handleOpenReplyBox}
                    onCloseReplyBox={this.handleCloseReplyBox}
                />

                <Comments
                    replies={replies}
                    expandedReplyId={expandedReplyId}
                    replyBoxOpenForId={replyBoxOpenForId}
                    onExpandReply={this.handleExpandReply}
                    onCollapseReply={this.handleCollapseReply}
                    onOpenReplyBox={this.handleOpenReplyBox}
                    onCloseReplyBox={this.handleCloseReplyBox}
                />
            </div>
        )
    }
}

const styles = {
    thread: {
        marginBottom: 15
    }
}

export default withStyles(styles)(Thread)
