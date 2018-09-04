import React from 'react'
import Post from './Post'
import Comments from './Comments'
import {withStyles} from '@material-ui/core/styles'
import fetchJson from '../util/fetchJson'
import withAuth from '../context/auth/withAuth'

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
        const {isLoggedIn, username} = this.props
        const {thread} = this.state

        this.setState(oldState => ({
            thread: {
                ...oldState.thread,
                collapsed: !oldState.thread.collapsed
            }
        }), async () => {
            if (isLoggedIn) await fetchJson('clientData/markPost', {
                method: 'POST',
                body: {
                    username: username,
                    postId: thread.threadId,
                    type: this.state.thread.collapsed ? 'collapsed' : 'unmarked'
                }
            })
        })
    }

    handleOpenReplyBox = id => this.setState({replyBoxOpenForId: id})
    handleCloseReplyBox = () => this.setState({replyBoxOpenForId: null})

    togglePinned = async () => {
        const {isLoggedIn, username} = this.props
        const {thread} = this.state

        this.setState(oldState => ({
            thread: {
                ...oldState.thread,
                pinned: !oldState.thread.pinned
            }
        }), async () => {
            if (isLoggedIn) await fetchJson('clientData/markPost', {
                method: 'POST',
                body: {
                    username: username,
                    postId: thread.threadId,
                    type: this.state.thread.pinned ? 'pinned' : 'unmarked'
                }
            })
        })
    }

    render() {
        const {classes} = this.props
        const {thread, expandedReplyId, replyBoxOpenForId} = this.state
        if (thread.collapsed) return null

        return (
            <div className={classes.thread}>
                <Post
                    post={thread}
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

export default withAuth(
    withStyles(styles)(
        Thread
    )
)
