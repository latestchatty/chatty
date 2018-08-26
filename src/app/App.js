import React from 'react'
import {Route, Switch} from 'react-router-dom'
import Nav from '../nav/Nav'
import Chatty from '../chatty/Chatty'

class App extends React.Component {
    render() {
        return (
            <React.Fragment>
                <Nav/>
                <Switch>
                    <Route path="/chatty" component={Chatty}/>

                    <Route component={Chatty}/>
                </Switch>
            </React.Fragment>
        )
    }
}

export default App
