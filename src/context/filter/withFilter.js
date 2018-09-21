import React from 'react'
import FilterContext from './FilterContext'

const withFilter = Child => props =>
    <FilterContext.Consumer>
        {filterProps => <Child {...props} {...filterProps}/>}
    </FilterContext.Consumer>

export default withFilter
