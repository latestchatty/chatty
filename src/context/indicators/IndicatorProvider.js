import React, {useState} from 'react'
import IndicatorContext from './IndicatorContext'
import AsyncLoadingIndicator from './AsyncLoadingIndicator'
import SyncLoadingIndicator from './SyncLoadingIndicator'

function IndicatorProvider({children}) {
    const [loading, setLoading] = useState(false)

    const showToast = msg => {
        // TODO: hook to toasts and replace other TODOs
    }

    const contextValue = {
        setLoading,
        showToast
    }

    return (
        <IndicatorContext.Provider value={contextValue}>
            <SyncLoadingIndicator loading={loading}/>
            <AsyncLoadingIndicator loading={loading}/>
            {children}
        </IndicatorContext.Provider>
    )
}

export default IndicatorProvider
