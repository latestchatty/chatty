import React, {useState} from 'react'
import FilterContext from './FilterContext'

function FilterProvider({children}) {
    const [filterSettings, setFilterSettings] = useState({
        showCollapsed: false,
        showFilteredUsers: false,
        filteredUsers: [],
        showFilteredTerms: false,
        filteredTerms: []
    })

    const isPostVisible = (thread, post = thread) => {
        const {
            showCollapsed,
            showFilteredUsers, filteredUsers,
            showFilteredTerms, filteredTerms
        } = filterSettings

        if (!showCollapsed && thread.markType === 'collapsed') return false
        else if (!showFilteredUsers && filteredUsers.some(({regex}) => regex.test(post.author))) return false
        else if (!showFilteredTerms && filteredTerms.some(({regex}) => regex.test(post.body))) return false

        return true
    }

    const contextValue = {
        filterSettings,
        setFilterSettings,
        isPostVisible
    }

    return (
        <FilterContext.Provider value={contextValue}>
            {children}
        </FilterContext.Provider>
    )
}

export default FilterProvider
