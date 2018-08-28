import React from 'react'
import AuthContext from './AuthContext'
import fetchJson from '../../util/fetchJson'
import querystring from 'querystring'
import withIndicators from '../indicators/withIndicators'

class AuthProvider extends React.PureComponent {
    constructor(props) {
        super(props)

        const {username, password} = this.loadStorage()
        this.state = {
            isLoggedIn: (username && password),
            username, password
        }
    }

    loadStorage() {
        try {
            const storageValue = localStorage.getItem('auth') || '{}'
            return JSON.parse(storageValue) || {}
        } catch (ex) {
            console.log('Invalid storage value: auth', ex)
        }
    }

    login = async (username, password) => {
        const {setLoading} = this.props
        try {
            setLoading('async')

            const result = await fetchJson(`verifyCredentials`, {
                method: 'POST',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                body: querystring.stringify({username, password})
            })

            if (result.isValid) {
                localStorage.setItem('auth', JSON.stringify({username, password}))
                this.setState({isLoggedIn: true, username, password})
            } else {
                // TODO: toast user
            }
        } catch (ex) {
            console.log('Error while logging in', ex)
            // TODO: toast user
        } finally {
            setLoading(false)
        }
    }

    logout = () => {
        localStorage.removeItem('auth')
        this.setState({isLoggedIn: false, username: null, password: null})
    }

    render() {
        const contextValue = {
            ...this.state,

            login: this.login,
            logout: this.logout
        }

        return (
            <AuthContext.Provider value={contextValue}>
                {this.props.children}
            </AuthContext.Provider>
        )
    }
}

export default withIndicators(AuthProvider)
