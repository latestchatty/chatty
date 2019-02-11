import React, {useContext, useState} from 'react'
import AuthContext from './AuthContext'
import fetchJson from '../../util/fetchJson'
import IndicatorContext from '../indicators/IndicatorContext'

function AuthProvider({children}) {
    const {setLoading} = useContext(IndicatorContext)
    const [credentials, setCredentials] = useState(() => {
        try {
            const storageValue = localStorage.getItem('auth') || '{}'
            const {username, password} = JSON.parse(storageValue) || {}
            return {username, password}
        } catch (ex) {
            console.log('Invalid storage value: auth', ex)
            localStorage.removeItem('auth')
            return {username: null, password: null}
        }
    })

    const login = async (username, password) => {
        try {
            setLoading('async')

            const result = await fetchJson(`verifyCredentials`, {method: 'POST', body: {username, password}})

            if (result.isValid) {
                localStorage.setItem('auth', JSON.stringify({username, password}))
                setCredentials({username, password})
            } else {
                console.log('Invalid login credentials.')
                // TODO: toast user
            }
        } catch (ex) {
            console.log('Error while logging in', ex)
            // TODO: toast user
        } finally {
            setLoading(false)
        }
    }

    const logout = () => {
        localStorage.removeItem('auth')
        setCredentials({username: null, password: null})
    }

    const isLoggedIn = credentials.username && credentials.password
    const contextValue = {...credentials, isLoggedIn, login, logout}

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider
