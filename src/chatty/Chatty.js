import React, {useContext} from 'react'
import Thread from '../thread/Thread'
import ChattyContext from '../context/chatty/ChattyContext'
import {makeStyles} from '@material-ui/styles'

function Chatty() {
    const classes = useStyles()
    const {threads} = useContext(ChattyContext)
    return (
        <div className={classes.chatty}>
            {threads.map(thread => <Thread key={thread.threadId} thread={thread}/>)}
        </div>
    )
}

const useStyles = makeStyles({
    chatty: {
        margin: '56px 8px 8px 8px',
        font: '12px/1.5 arial, helvetica, clean, sans-serif'
    }
})

export default Chatty
