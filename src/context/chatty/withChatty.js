import React from 'react'
import ChattyContext from './ChattyContext'

const withChatty = Child => props =>
    <ChattyContext.Consumer>
        {chattyProps => <Child {...props} {...chattyProps}/>}
    </ChattyContext.Consumer>

export default withChatty
