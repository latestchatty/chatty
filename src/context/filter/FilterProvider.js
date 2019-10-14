import React, {useCallback, useContext, useEffect, useState, useMemo} from 'react'
import FilterContext from './FilterContext'
import ClientDataContext from '../clientData/ClientDataContext'
import IndicatorContext from '../indicators/IndicatorContext'
import {cleanAllStyles} from '../../util/bodyUtils'

function FilterProvider({children}) {
    const {clientData, updateClientData} = useContext(ClientDataContext)
    const [filterSettings, setFilterSettings] = useState(defaultSettings)
    const {showSnackbar} = useContext(IndicatorContext)

    const updateCloudFilterSettings = useCallback(async cloudFilterSettings => {
        try {
            await updateClientData('filterSettings', cloudFilterSettings)
        } catch (err) {
            console.error('Error updating clientData.filterSettings.')
            showSnackbar('Error updating filter settings, changes may have been lost.', {variant: 'error'})
        }
    }, [showSnackbar, updateClientData])

    useEffect(() => {
        try {
            if (clientData && clientData.filterSettings) {
                const {filterSettings: cfs} = clientData
                setFilterSettings({
                    filteredTerms: (cfs.filteredTerms || [])
                        .map(text => ({text, regex: new RegExp(text, 'mi')})),
                    filteredUsers: (cfs.filteredUsers || [])
                        .map(text => ({text, regex: new RegExp(text, 'mi')})),
                    showCollapsed: !!cfs.showCollapsed,
                    showFilteredTerms: !!cfs.showFilteredTerms,
                    showFilteredUsers: !!cfs.showFilteredUsers,
                })
            }
        } catch (ex) {
            console.error('Error parsing clientData.filterSettings, resetting to default.')
            showSnackbar('Error loading filter settings, resetting to default.', {variant: 'error'})
            updateCloudFilterSettings(defaultSettings)
            setFilterSettings(defaultSettings)
        }
    }, [clientData, showSnackbar, updateCloudFilterSettings])

    const isPostVisible = useCallback((thread, post = thread) => {
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
    }, [filterSettings])

    const updateFilterSettings = useCallback(async updatedSettings => {
        const newFilterSettings = {...filterSettings, ...updatedSettings}
        const cloudFilterSettings = {
            ...newFilterSettings,
            filteredTerms: newFilterSettings.filteredTerms.map(item => item.text),
            filteredUsers: newFilterSettings.filteredUsers.map(item => item.text)
        }

        updateCloudFilterSettings(cloudFilterSettings)
        setFilterSettings(newFilterSettings)
    }, [filterSettings, updateCloudFilterSettings])

    const contextValue = useMemo(() => ({
        filterSettings,
        updateFilterSettings,
        isPostVisible
    }), [filterSettings, isPostVisible, updateFilterSettings])

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
