import React from 'react'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import LoginButton from '../auth/LoginButton'
import LogoutButton from '../auth/LogoutButton'
import IconButton from '@material-ui/core/IconButton'
import Divider from '@material-ui/core/Divider'
import PersonIcon from '@material-ui/icons/Person'
import withAuth from '../context/auth/withAuth'

class UserMenu extends React.Component {
    state = {open: false}

    handleClick = event => this.setState({open: true, anchorEl: event.target})
    handleClose = () => this.setState({open: false})

    render() {
        const {open, anchorEl} = this.state
        const {isLoggedIn} = this.props

        if (!isLoggedIn) return <LoginButton/>
        return (
            <React.Fragment>
                <IconButton onClick={this.handleClick}>
                    <PersonIcon/>
                </IconButton>

                <Menu
                    keepMounted
                    open={open}
                    anchorEl={anchorEl}
                    onClose={this.handleClose}
                >
                    <MenuItem disabled>{this.props.username}</MenuItem>
                    <Divider/>
                    <LogoutButton/>
                </Menu>
            </React.Fragment>
        )
    }
}

export default withAuth(UserMenu)
