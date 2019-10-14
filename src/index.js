import React from 'react'
import ReactDOM from 'react-dom'
import Root from './app/Root'

const render = Component => ReactDOM.render(<Component/>, document.getElementById('root'))

render(Root)

if (module.hot) {
    module.hot.accept('./app/Root', () => {
        const next = require('./app/Root').default
        render(next)
    })
}
