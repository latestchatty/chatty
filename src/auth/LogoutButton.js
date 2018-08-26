import React from 'react'
import MenuItem from '@material-ui/core/MenuItem'
import withAuth from '../context/auth/withAuth'

class LoginButton extends React.Component {
    render() {
        return (
            <MenuItem onClick={this.props.logout}>Logout</MenuItem>
        )
    }
}

export default withAuth(LoginButton)
