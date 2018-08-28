import React from 'react'
import MenuItem from '@material-ui/core/MenuItem'
import withAuth from '../context/auth/withAuth'

class LoginButton extends React.Component {
    handleClick = () => {
        const {logout, onClick} = this.props
        onClick && onClick()
        logout()
    }
    render() {
        return (
            <MenuItem onClick={this.handleClick}>Logout</MenuItem>
        )
    }
}

export default withAuth(LoginButton)
