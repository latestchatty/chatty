import React from 'react'
import ChattyContext from './MessagesContext'

const withMessages = Child => props =>
    <ChattyContext.Consumer>
        {chattyProps => <Child {...props} {...chattyProps}/>}
    </ChattyContext.Consumer>

export default withMessages
