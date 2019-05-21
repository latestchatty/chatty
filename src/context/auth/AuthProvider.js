import React, {useCallback, useContext, useMemo, useState} from 'react'
import AuthContext from './AuthContext'
import fetchJson from '../../util/fetchJson'
import IndicatorContext from '../indicators/IndicatorContext'

function AuthProvider({children}) {
    const {setLoading, showSnackbar} = useContext(IndicatorContext)
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

    const login = useCallback(async (username, password) => {
        try {
            setLoading('async')

            const result = await fetchJson(`verifyCredentials`, {method: 'POST', body: {username, password}})

            if (result.isValid) {
                localStorage.setItem('auth', JSON.stringify({username, password}))
                setCredentials({username, password})
            } else {
                console.log('Invalid login credentials.')
                showSnackbar('Invalid username/password. Please check them and try again')
            }
        } catch (ex) {
            console.log('Error while logging in', ex)
            showSnackbar('Error while logging in. Please try again later.')
        } finally {
            setLoading(false)
        }
    }, [setLoading, showSnackbar])

    const logout = useCallback(() => {
        localStorage.removeItem('auth')
        setCredentials({username: null, password: null})
    }, [])

    const isLoggedIn = credentials.username && credentials.password
    const contextValue = useMemo(() => ({
        ...credentials, 
        isLoggedIn, 
        login, 
        logout
    }), [credentials, isLoggedIn, login, logout])

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider
