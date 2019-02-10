import React from 'react'
import {MuiThemeProvider} from '@material-ui/core/styles'
import Theme from './Theme'
import App from './App'
import AuthProvider from '../context/auth/AuthProvider'
import ChattyProvider from '../context/chatty/ChattyProvider'
import './global.css'
import './shacktags.css'
import './comment_tree.css'
import IndicatorProvider from '../context/indicators/IndicatorProvider'
import FilterProvider from '../context/filter/FilterProvider'
import {Router} from 'react-router-dom'
import history from '../history'

function Root() {
    return (
        <Router history={history}>
            <MuiThemeProvider theme={Theme}>
                <IndicatorProvider>
                    <AuthProvider>
                        <ChattyProvider>
                            <FilterProvider>
                                <App/>
                            </FilterProvider>
                        </ChattyProvider>
                    </AuthProvider>
                </IndicatorProvider>
            </MuiThemeProvider>
        </Router>
    )
}

export default Root
