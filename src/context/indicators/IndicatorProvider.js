import React, {useState} from 'react'
import IndicatorContext from './IndicatorContext'
import AsyncLoadingIndicator from './AsyncLoadingIndicator'
import SyncLoadingIndicator from './SyncLoadingIndicator'
import Snackbars from './Snackbars'

function IndicatorProvider({children}) {
    const [loading, setLoading] = useState(false)
    const [snackbars, setSnackbars] = useState([])

    const showSnackbar = message => setSnackbars(snackbars.concat([message]))

    const contextValue = {
        setLoading,
        showSnackbar
    }

    return (
        <IndicatorContext.Provider value={contextValue}>
            <SyncLoadingIndicator loading={loading}/>
            <AsyncLoadingIndicator loading={loading}/>
            <Snackbars snackbars={snackbars} setSnackbars={setSnackbars}/>
            {children}
        </IndicatorContext.Provider>
    )
}

export default IndicatorProvider
