import React from 'react'
import IndicatorContext from './IndicatorContext'

const withIndicators = Child => props =>
    <IndicatorContext.Consumer>
        {indicatorProps => <Child {...props} {...indicatorProps}/>}
    </IndicatorContext.Consumer>

export default withIndicators
