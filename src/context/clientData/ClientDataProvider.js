import React, {useContext, useEffect, useState} from 'react'
import ClientDataContext from './ClientDataContext'
import fetchJson from '../../util/fetchJson'
import AuthContext from '../auth/AuthContext'
import querystring from 'querystring'
import IndicatorContext from '../indicators/IndicatorContext'

function ClientDataProvider({children}) {
    const [clientData, setClientData] = useState({})
    const {isLoggedIn, username} = useContext(AuthContext)
    const {showSnackbar} = useContext(IndicatorContext)

    const loadClientData = async () => {
        if (isLoggedIn) {
            try {
                const params = querystring.stringify({client, username: encodeURIComponent(username)})
                const {data: encoded = ''} = await fetchJson(`clientData/getClientData?${params}`)
                const decoded = atob(encoded) || '{}'
                const data = JSON.parse(decoded)
                setClientData(data)
            } catch (ex) {
                showSnackbar('Error loading user preferences.')
                console.error('Error loading client data', ex)
                setClientData({})
                // TODO: Reset client data in cloud?
            }
        } else {
            setClientData({})
        }
    }

    const updateClientData = async (key, value) => {
        try {
            const newClientData = {
                ...clientData
            }
            if (key) newClientData[key] = value
            const data = btoa(JSON.stringify(newClientData))
            const body = {client, username: encodeURIComponent(username), data}
            const result = await fetchJson(`clientData/setClientData`, {method: 'POST', body})
            if (result.error) {
                showSnackbar('Error updating user preferences.')
                console.log('Error setting client data', result)
            }
        } catch (ex) {
            showSnackbar('Error updating user preferences.')
            console.error('Error setting client data', ex)
        }
    }

    useEffect(() => {
        loadClientData()
    }, [isLoggedIn])

    const contextValue = {
        clientData,
        updateClientData
    }

    if (isLoggedIn && !clientData) return null
    return (
        <ClientDataContext.Provider value={contextValue}>
            {children}
        </ClientDataContext.Provider>
    )
}

const client = 'nixxedchatty'

export default ClientDataProvider
