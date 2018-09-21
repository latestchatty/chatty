import React from 'react'
import Post from './Post'
import OneLine from './OneLine'
import withFilter from '../context/filter/withFilter'

class Comments extends React.PureComponent {
    render() {
        const {
            thread = {}, parent = thread, onCollapseReply, onExpandReply, onOpenReplyBox, expandedReplyId,
            replyBoxOpenForId, onCloseReplyBox, isPostVisible
        } = this.props

        return (
            <ul className='comments'>
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
                                <Self
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

const Self = withFilter(Comments)
export default Self
