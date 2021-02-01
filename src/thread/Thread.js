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
    const {username, isLoggedIn} = useContext(AuthContext)
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
            posts,
            markType
        }
    }, [rawThread, markType])
    const visibleReplyCount = useMemo(() => {
        const visiblePosts = thread.posts
            .filter(post => isPostVisible(thread, post))
            .sort((a, b) => a.id - b.id)
        const visiblePostIds = visiblePosts
            .reduce((acc, post) => ({...acc, [post.id]: !!acc[post.parentId]}), {0: true})
        return visiblePosts.reduce((acc, post) => acc + (visiblePostIds[post.parentId] ? 1 : 0), 0) - 1
    }, [isPostVisible, thread])
    const [truncated, setTruncated] = useState(visibleReplyCount > 20)

    const markThread = async type => {
        setMarkType(type)
        markPost(thread, type)
    }
    const markPost = async (post, type) => {
        post.markType = type
        if (isLoggedIn) {
            try {
                await fetchJson('clientData/markPost', {
                    method: 'POST',
                    body: {username, postId: post.id, type}
                })
            } catch (ex) {
                console.error('Error marking post.', ex)
            }
        }
    }

    const handleExpandReply = expandedReplyId => {
        setExpandedReplyId(expandedReplyId)
        setReplyBoxOpenForId(null)
        setTruncated(false)
    }
    const handleCollapseReply = () => {
        setExpandedReplyId(null)
        setReplyBoxOpenForId(null)
    }
    const handleOpenReplyBox = id => setReplyBoxOpenForId(id)
    const handleCloseReplyBox = () => setReplyBoxOpenForId(null)

    const handleHide = post => markPost(post, post.markType !== 'collapsed' ? 'collapsed' : 'unmarked')
    const handleCollapse = () => markThread(thread.threadId, thread.markType !== 'collapsed' ? 'collapsed' : 'unmarked')
    const togglePinned = () => markThread(thread.threadId, thread.markType !== 'pinned' ? 'pinned' : 'unmarked')

    const visible = useMemo(() => isPostVisible(thread), [isPostVisible, thread])
    if (!visible) return null
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

            {
                truncated &&
                <div className={classes.truncatedMessage} onClick={() => setTruncated(false)}>
                    Thread truncated. Click to see all&nbsp;
                    <span className={classes.replyCount}>{visibleReplyCount}</span>
                    &nbsp;replies.
                </div>
            }

            <div className={truncated ? classes.truncatedContainer : null}>
                <Comments
                    className={truncated ? classes.truncatedComments : null}
                    thread={thread}
                    expandedReplyId={expandedReplyId}
                    replyBoxOpenForId={replyBoxOpenForId}
                    onExpandReply={handleExpandReply}
                    onHide={handleHide}
                    onCollapseReply={handleCollapseReply}
                    onOpenReplyBox={handleOpenReplyBox}
                    onCloseReplyBox={handleCloseReplyBox}
                />
            </div>
        </div>
    )
}

const useStyles = makeStyles({
    thread: {
        marginBottom: 15
    },
    truncatedMessage: {
        color: '#fff',
        fontWeight: 'bold',
        borderTop: '1px solid #656565',
        borderBottom: '1px dotted #fff',
        backgroundColor: '#181818',
        cursor: 'pointer',
        marginTop: -3,
        '&:hover': {
            backgroundColor: '#282828'
        }
    },
    replyCount: {
        color: '#00bff3'
    },
    truncatedContainer: {
        height: 300,
        overflow: 'hidden',
        position: 'relative'
    },
    truncatedComments: {
        position: 'absolute !important',
        bottom: 0
    }
})

export default React.memo(Thread)
