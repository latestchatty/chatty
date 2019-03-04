import React from 'react'
import {ThemeProvider} from '@material-ui/styles'
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
import ClientDataProvider from '../context/clientData/ClientDataProvider'

function Root() {
    return (
        <Router history={history}>
            <ThemeProvider theme={Theme}>
                <IndicatorProvider>
                    <AuthProvider>
                        <ClientDataProvider>
                            <FilterProvider>
                                <ChattyProvider>
                                    <App/>
                                </ChattyProvider>
                            </FilterProvider>
                        </ClientDataProvider>
                    </AuthProvider>
                </IndicatorProvider>
            </ThemeProvider>
        </Router>
    )
}

export default Root
