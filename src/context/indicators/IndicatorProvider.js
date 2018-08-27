import React from 'react'
import IndicatorContext from './IndicatorContext'
import AsyncLoadingIndicator from './AsyncLoadingIndicator'

class IndicatorProvider extends React.PureComponent {
    state = {
        loading: false,
        toast: false
    }

    setLoading = loading => this.setState({loading})

    showToast = msg => {
        // TODO: hook to toasts and replace other TODOs
    }

    render() {
        const {loading} = this.state

        const contextValue = {
            setLoading: this.setLoading,
            showToast: this.showToast
        }

        return (
            <IndicatorContext.Provider value={contextValue}>
                <AsyncLoadingIndicator loading={loading}/>
                {this.props.children}
            </IndicatorContext.Provider>
        )
    }
}

export default IndicatorProvider
