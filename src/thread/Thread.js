import React, {useContext, useMemo, useState} from 'react'
import Post from './Post'
import Comments from './Comments'
import ChattyContext from '../context/chatty/ChattyContext'
import FilterContext from '../context/filter/FilterContext'
import {makeStyles} from '@material-ui/styles'

function Thread({thread: rawThread}) {
    const classes = useStyles()
    const [expandedReplyId, setExpandedReplyId] = useState(null)
    const [replyBoxOpenForId, setReplyBoxOpenForId] = useState(null)
    const {markThread} = useContext(ChattyContext)
    const {isPostVisible} = useContext(FilterContext)
    const thread = useMemo(() => {
        const posts = rawThread.posts ? rawThread.posts.sort((a, b) => a.id - b.id) : []

        // oneline highlights
        posts.slice(-10)
            .reverse()
            .forEach((post, index) => post.recentReplyNumber = index + 1)

        const [post] = posts
        return {
            ...rawThread,
            ...post,
            id: +rawThread.threadId,
            posts: posts
        }
    }, [rawThread])
    if (!isPostVisible(rawThread)) return null

    const handleExpandReply = expandedReplyId => {
        setExpandedReplyId(expandedReplyId)
        setReplyBoxOpenForId(null)
    }
    const handleCollapseReply = () => {
        setExpandedReplyId(null)
        setReplyBoxOpenForId(null)
    }
    const handleOpenReplyBox = id => setReplyBoxOpenForId(id)
    const handleCloseReplyBox = () => setReplyBoxOpenForId(null)

    const handleCollapse = () => markThread(thread.threadId, thread.collapsed ? 'unmarked' : 'collapsed')
    const togglePinned = () => markThread(thread.threadId, thread.pinned ? 'unmarked' : 'pinned')

    return (
        <div className={classes.thread}>
            <Post
                post={thread}
                thread={thread}
                replyBoxOpenForId={replyBoxOpenForId}
                onCollapse={handleCollapse}
                onOpenReplyBox={handleOpenReplyBox}
                onCloseReplyBox={handleCloseReplyBox}
                onPinned={togglePinned}
            />

            <Comments
                thread={thread}
                expandedReplyId={expandedReplyId}
                replyBoxOpenForId={replyBoxOpenForId}
                onExpandReply={handleExpandReply}
                onCollapseReply={handleCollapseReply}
                onOpenReplyBox={handleOpenReplyBox}
                onCloseReplyBox={handleCloseReplyBox}
            />
        </div>
    )
}

const useStyles = makeStyles({
    thread: {
        marginBottom: 15
    }
})

export default Thread
