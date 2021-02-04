import React, {useContext, useMemo} from 'react'
import Post from './Post'
import OneLine from './OneLine'
import classnames from 'classnames'
import FilterContext from '../context/filter/FilterContext'

function Comments({className, thread = {}, parent = thread, onHide, onCollapseReply, onExpandReply, onOpenReplyBox, expandedReplyId, replyBoxOpenForId, onCloseReplyBox}) {
    const {isPostVisible} = useContext(FilterContext)

    const comments = useMemo(() => {
        return thread.posts
            .filter(post => post.parentId === parent.id)
            .filter(post => isPostVisible(thread, post))
    }, [isPostVisible, parent.id, thread])

    return (
        <ul className={classnames('comments', className)}>
            {
                comments.map(post =>
                    <li key={post.id}>
                        {
                            expandedReplyId === post.id
                                ? <Post
                                    post={post}
                                    thread={thread}
                                    onHide={onHide}
                                    onCollapse={onCollapseReply}
                                    replyBoxOpenForId={replyBoxOpenForId}
                                    onOpenReplyBox={onOpenReplyBox}
                                    onCloseReplyBox={onCloseReplyBox}
                                />
                                : <OneLine
                                    post={post}
                                    thread={thread}
                                    onExpandReply={onExpandReply}
                                />
                        }
                        <Comments
                            thread={thread}
                            parent={post}
                            expandedReplyId={expandedReplyId}
                            replyBoxOpenForId={replyBoxOpenForId}
                            onExpandReply={onExpandReply}
                            onHide={onHide}
                            onCollapseReply={onCollapseReply}
                            onOpenReplyBox={onOpenReplyBox}
                            onCloseReplyBox={onCloseReplyBox}
                        />
                    </li>
                )
            }
        </ul>
    )
}

export default Comments
