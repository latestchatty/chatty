import React, {useCallback, useContext, useEffect, useState, useMemo} from 'react'
import ClientDataContext from './ClientDataContext'
import fetchJson from '../../util/fetchJson'
import AuthContext from '../auth/AuthContext'
import querystring from 'querystring'
import IndicatorContext from '../indicators/IndicatorContext'

function ClientDataProvider({children}) {
    const [clientData, setClientData] = useState({})
    const {isLoggedIn, username} = useContext(AuthContext)
    const {showSnackbar} = useContext(IndicatorContext)

    const updateClientData = useCallback(async (key, value) => {
        try {
            const newClientData = {
                ...clientData
            }
            if (key) newClientData[key] = value
            const data = JSON.stringify(newClientData)
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
    }, [clientData, showSnackbar, username])
    
    useEffect(() => {
        const loadClientData = async () => {
            if (isLoggedIn) {
                try {
                    const params = querystring.stringify({client, username: encodeURIComponent(username)})
                    const {data: string = ''} = await fetchJson(`clientData/getClientData?${params}`)
                    const data = JSON.parse(string)
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
        
        loadClientData()
    }, [isLoggedIn, showSnackbar, username])

    const contextValue = useMemo(() => ({
        clientData,
        updateClientData
    }), [clientData, updateClientData])

    if (isLoggedIn && !clientData) return null
    return (
        <ClientDataContext.Provider value={contextValue}>
            {children}
        </ClientDataContext.Provider>
    )
}

const client = 'nixxedchatty'

export default ClientDataProvider
