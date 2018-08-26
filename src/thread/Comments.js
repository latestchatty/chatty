import React from 'react'
import Post from './Post'
import OneLine from './OneLine'

class Comments extends React.PureComponent {
    state = {}

    render() {
        const {
            replies = [], onCollapseReply, onExpandReply, onOpenReplyBox, expandedReplyId, replyBoxOpenForId,
            onCloseReplyBox
        } = this.props

        return (
            <ul className="comments">
                {
                    replies.map(reply =>
                        <li key={reply.id}>
                            {
                                expandedReplyId === reply.id
                                    ? <Post
                                        post={reply}
                                        onCollapse={onCollapseReply}
                                        replyBoxOpenForId={replyBoxOpenForId}
                                        onOpenReplyBox={onOpenReplyBox}
                                        onCloseReplyBox={onCloseReplyBox}
                                    />
                                    : <OneLine
                                        post={reply}
                                        onExpandReply={onExpandReply}
                                    />
                            }
                            <Comments
                                replies={reply.posts}
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
