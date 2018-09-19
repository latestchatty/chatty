import React from 'react'
import Post from './Post'
import OneLine from './OneLine'

class Comments extends React.PureComponent {
    render() {
        const {
            thread = {}, parent = thread, onCollapseReply, onExpandReply, onOpenReplyBox, expandedReplyId,
            replyBoxOpenForId, onCloseReplyBox
        } = this.props

        return (
            <ul className="comments">
                {
                    thread.posts
                        .filter(post => post.parentId === parent.id)
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
}

export default Comments
