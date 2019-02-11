import React, {useContext} from 'react'
import Post from './Post'
import OneLine from './OneLine'
import FilterContext from '../context/filter/FilterContext'
import classnames from 'classnames'

function Comments({className, thread = {}, parent = thread, onCollapseReply, onExpandReply, onOpenReplyBox, expandedReplyId, replyBoxOpenForId, onCloseReplyBox}) {
    const {isPostVisible} = useContext(FilterContext)
    return (
        <ul className={classnames('comments', className)}>
            {
                thread.posts
                    .filter(post => post.parentId === parent.id)
                    .filter(post => isPostVisible(thread, post))
                    .map(post =>
                        <li key={post.id}>
                            {
                                expandedReplyId === post.id
                                    ? <Post
                                        post={post}
                                        thread={thread}
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
