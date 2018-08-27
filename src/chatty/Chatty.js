import React from 'react'
import Thread from '../thread/Thread'
import withChatty from '../context/chatty/withChatty'

class Chatty extends React.PureComponent {
    render() {
        let {threads} = this.props
        return (
            <div style={styles.chatty}>
                {threads.map(thread => <Thread key={thread.threadId} thread={thread}/>)}
            </div>
        )
    }
}

const styles = {
    chatty: {
        margin: '72px 8px 8px 8px',
        font: '12px/1.5 arial, helvetica, clean, sans-serif'
    }
}

export default withChatty(Chatty)
