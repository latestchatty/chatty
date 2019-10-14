import React, {useMemo, useState} from 'react'
import IndicatorContext from './IndicatorContext'
import AsyncLoadingIndicator from './AsyncLoadingIndicator'
import SyncLoadingIndicator from './SyncLoadingIndicator'
import {useSnackbar} from 'notistack'

function IndicatorProvider({children}) {
    const [loading, setLoading] = useState(false)
    const {enqueueSnackbar} = useSnackbar()

    const contextValue = useMemo(() => ({
        setLoading,
        showSnackbar: enqueueSnackbar
    }), [enqueueSnackbar])

    return (
        <IndicatorContext.Provider value={contextValue}>
            <SyncLoadingIndicator loading={loading}/>
            <AsyncLoadingIndicator loading={loading}/>
            {children}
        </IndicatorContext.Provider>
    )
}

export default IndicatorProvider
