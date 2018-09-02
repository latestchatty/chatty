import React from 'react'
import Post from './Post'
import Comments from './Comments'
import {withStyles} from '@material-ui/core/styles'

class Thread extends React.PureComponent {
    state = {
        thread: {
            posts: []
        },
        collapsed: false,
        expandedReplyId: null,
        replyBoxOpenForId: null
    }

    componentDidMount() {
        this.loadThread()
    }

    componentDidUpdate(prevProps) {
        if (prevProps.thread !== this.props.thread) this.loadThread()
    }

    loadThread() {
        const {thread: raw = {posts: []}} = this.props
        const post = raw.posts.find(post => !post.parentId)
        const posts = raw.posts.filter(post => post.parentId).reverse()
        // TODO: Does this work with event updates?
        posts.slice(-10)
            .reverse()
            .forEach((post, index) => post.recentReplyNumber = index + 1)

        const thread = {
            ...post,
            id: +raw.threadId,
            posts: posts
        }
        this.setState({thread})
    }

    handleCollapseReply = () => this.setState({expandedReplyId: null, replyBoxOpenForId: null})
    handleExpandReply = expandedReplyId => this.setState({expandedReplyId, replyBoxOpenForId: null})
    handleCollapse = () => this.setState({collapsed: true, replyBoxOpenForId: null})
    handleOpenReplyBox = id => this.setState({replyBoxOpenForId: id})
    handleCloseReplyBox = () => this.setState({replyBoxOpenForId: null})

    render() {
        const {classes} = this.props
        const {collapsed, thread, expandedReplyId, replyBoxOpenForId} = this.state
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
                    thread={thread}
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
