import React from 'react'
import ReactDOM from 'react-dom'
import {Router} from 'react-router-dom'
import history from './history'
import Root from './app/Root'

function render(Component) {
    ReactDOM.render(
        (
            <Router history={history}>
                <Component/>
            </Router>
        ),
        document.getElementById('root')
    )
}

render(Root)

if (module.hot) {
    module.hot.accept('./app/Root', () => {
        const next = require('./app/Root').default
        render(next)
    })
}
