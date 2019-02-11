import React, {useContext, useMemo, useState} from 'react'
import Post from './Post'
import Comments from './Comments'
import FilterContext from '../context/filter/FilterContext'
import {makeStyles} from '@material-ui/styles'
import fetchJson from '../util/fetchJson'
import AuthContext from '../context/auth/AuthContext'

function Thread({thread: rawThread}) {
    const classes = useStyles()
    const [expandedReplyId, setExpandedReplyId] = useState(null)
    const [replyBoxOpenForId, setReplyBoxOpenForId] = useState(null)
    const [markType, setMarkType] = useState(rawThread.markType)
    const {username} = useContext(AuthContext)
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
            posts: posts,
            markType
        }
    }, [rawThread, markType])
    if (!isPostVisible(rawThread)) return null

    const markThread = async (postId, type) => {
        await fetchJson('clientData/markPost', {
            method: 'POST',
            body: {username, postId, type}
        })
        setMarkType(type)
    }

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

    const handleCollapse = () => markThread(thread.threadId, thread.markType === 'unmarked' ? 'collapsed' : 'unmarked')
    const togglePinned = () => markThread(thread.threadId, thread.markType === 'unmarked' ? 'pinned' : 'unmarked')

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

export default React.memo(Thread)
