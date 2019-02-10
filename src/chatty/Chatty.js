import React, {useContext} from 'react'
import Thread from '../thread/Thread'
import ChattyContext from '../context/chatty/ChattyContext'

function Chatty() {
    const {threads} = useContext(ChattyContext)
    return (
        <div style={styles.chatty}>
            {threads.map(thread => <Thread key={thread.threadId} thread={thread}/>)}
        </div>
    )
}

const styles = {
    chatty: {
        margin: '72px 8px 8px 8px',
        font: '12px/1.5 arial, helvetica, clean, sans-serif'
    }
}

export default Chatty
