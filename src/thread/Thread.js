import React from 'react'
import Post from './Post'
import Comments from './Comments'
import {withStyles} from '@material-ui/core/styles'
import withChatty from '../context/chatty/withChatty'
import withFilter from '../context/filter/withFilter'

class Thread extends React.PureComponent {
    state = {
        thread: {
            pinned: false,
            collapsed: false,
            posts: []
        },
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
        const {thread: raw} = this.props
        const posts = raw.posts ? raw.posts.sort((a, b) => a.id - b.id) : []

        // oneline highlights
        posts.slice(-10)
            .reverse()
            .forEach((post, index) => post.recentReplyNumber = index + 1)

        const [post] = posts
        const thread = {
            ...raw,
            ...post,
            id: +raw.threadId,
            posts: posts
        }
        this.setState({thread})
    }

    handleCollapseReply = () => this.setState({expandedReplyId: null, replyBoxOpenForId: null})
    handleExpandReply = expandedReplyId => this.setState({expandedReplyId, replyBoxOpenForId: null})

    handleCollapse = async () => {
        const {markThread} = this.props
        const {thread} = this.state
        markThread(thread.threadId, thread.collapsed ? 'unmarked' : 'collapsed')
        this.setState(oldState => ({
            thread: {
                ...oldState.thread,
                collapsed: !thread.collapsed
            }
        }))
    }

    handleOpenReplyBox = id => this.setState({replyBoxOpenForId: id})
    handleCloseReplyBox = () => this.setState({replyBoxOpenForId: null})

    togglePinned = async () => {
        const {markThread} = this.props
        const {thread} = this.state
        markThread(thread.threadId, thread.pinned ? 'unmarked' : 'pinned')
        this.setState(oldState => ({
            thread: {
                ...oldState.thread,
                pinned: !thread.pinned
            }
        }))
    }

    render() {
        const {classes, isPostVisible} = this.props
        const {thread, expandedReplyId, replyBoxOpenForId} = this.state
        if (!isPostVisible(thread)) return null

        return (
            <div className={classes.thread}>
                <Post
                    post={thread}
                    thread={thread}
                    replyBoxOpenForId={replyBoxOpenForId}
                    onCollapse={this.handleCollapse}
                    onOpenReplyBox={this.handleOpenReplyBox}
                    onCloseReplyBox={this.handleCloseReplyBox}
                    onPinned={this.togglePinned}
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

export default withStyles(styles)(
    withChatty(
        withFilter(
            Thread
        )
    )
)
