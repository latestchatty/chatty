import React, {useContext, useEffect, useState} from 'react'
import FilterContext from './FilterContext'
import ClientDataContext from '../clientData/ClientDataContext'
import {cleanAllStyles} from '../../util/bodyUtils'

function FilterProvider({children}) {
    const {clientData} = useContext(ClientDataContext)
    const [filterSettings, setFilterSettings] = useState(defaultSettings)
    const {updateClientData} = useContext(ClientDataContext)
    useEffect(() => {
        try {
            if (clientData && clientData.filterSettings) {
                const {filterSettings: cfs} = clientData
                setFilterSettings({
                    ...filterSettings,
                    ...{
                        filteredTerms: (cfs.filteredTerms || [])
                            .map(text => ({text, regex: new RegExp(text, 'gmi')})),
                        filteredUsers: (cfs.filteredUsers || [])
                            .map(text => ({text, regex: new RegExp(text, 'gmi')})),
                        showCollapsed: !!cfs.showCollapsed,
                        showFilteredTerms: !!cfs.showFilteredTerms,
                        showFilteredUsers: !!cfs.showFilteredUsers,
                    }
                })
            }
        } catch (ex) {
            console.error('Error parsing clientData.filterSettings, resetting to default.')
            updateFilterSettings(defaultSettings)
        }
    }, [clientData])

    const isPostVisible = (thread, post = thread) => {
        const {
            showCollapsed,
            showFilteredUsers,
            filteredUsers,
            showFilteredTerms,
            filteredTerms
        } = filterSettings

        if (!showCollapsed && thread.markType === 'collapsed') return false
        else if (!showFilteredUsers && filteredUsers.some(({regex}) => regex.test(post.author))) return false
        else if (!showFilteredTerms && filteredTerms.some(({regex}) => regex.test(cleanAllStyles(post.body)))) return false

        return true
    }

    const updateFilterSettings = async updatedSettings => {
        const newFilterSettings = {...filterSettings, ...updatedSettings}
        const cloudFilterSettings = {
            ...newFilterSettings,
            filteredTerms: newFilterSettings.filteredTerms.map(item => item.text),
            filteredUsers: newFilterSettings.filteredUsers.map(item => item.text)
        }
        await updateClientData('filterSettings', cloudFilterSettings)
        setFilterSettings(newFilterSettings)
    }

    const contextValue = {
        filterSettings,
        updateFilterSettings,
        isPostVisible
    }

    return (
        <FilterContext.Provider value={contextValue}>
            {children}
        </FilterContext.Provider>
    )
}

const defaultSettings = {
    filteredTerms: [],
    filteredUsers: [],
    showCollapsed: false,
    showFilteredTerms: false,
    showFilteredUsers: false
}

export default FilterProvider
