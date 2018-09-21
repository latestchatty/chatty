import React from 'react'
import FilterContext from './FilterContext'

class FilterProvider extends React.PureComponent {
    state = {
        showCollapsed: false,
        showFilteredUsers: false,
        filteredUsers: [],
        showFilteredTerms: false,
        filteredTerms: []
    }

    isPostVisible(thread, post = thread) {
        const {
            showCollapsed,
            showFilteredUsers, filteredUsers,
            showFilteredTerms, filteredTerms
        } = this.state

        if (!showCollapsed && thread.collapsed) return false
        else if (!showFilteredUsers && filteredUsers.some(({regex}) => regex.test(post.author))) return false
        else if (!showFilteredTerms && filteredTerms.some(({regex}) => regex.test(post.body))) return false

        return true
    }

    render() {
        const contextValue = {
            filterSettings: {...this.state},
            updateFilterSettings: settings => this.setState({...settings}),
            isPostVisible: (thread, post) => this.isPostVisible(thread, post)
        }

        return (
            <FilterContext.Provider value={contextValue}>
                {this.props.children}
            </FilterContext.Provider>
        )
    }
}

export default FilterProvider
