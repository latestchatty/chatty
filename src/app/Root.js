import React from 'react'
import {MuiThemeProvider} from '@material-ui/core/styles'
import Theme from './Theme'
import App from './App'
import AuthProvider from '../context/auth/AuthProvider'
import ChattyProvider from '../context/chatty/ChattyProvider'
import './global.css'
import './shacktags.css'
import './comment_tree.css'

class Root extends React.Component {
    render() {
        return (
            <MuiThemeProvider theme={Theme}>
                <AuthProvider>
                    <ChattyProvider>
                        <App/>
                    </ChattyProvider>
                </AuthProvider>
            </MuiThemeProvider>
        )
    }
}

export default Root
