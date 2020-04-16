import React, {useContext, useState} from 'react'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import LoginButton from '../auth/LoginButton'
import LogoutButton from '../auth/LogoutButton'
import IconButton from '@material-ui/core/IconButton'
import Divider from '@material-ui/core/Divider'
import PersonIcon from '@material-ui/icons/Person'
import AuthContext from '../context/auth/AuthContext'

function UserMenu() {
    const {isLoggedIn, username} = useContext(AuthContext)
    const [anchorEl, setAnchorEl] = useState(null)

    if (!isLoggedIn) return <LoginButton/>
    return (
        <React.Fragment>
            <IconButton size="small" onClick={event => setAnchorEl(event.target)}>
                <PersonIcon/>
            </IconButton>

            {anchorEl && <Menu
                keepMounted
                open={!!anchorEl}
                anchorEl={anchorEl}
                onClose={() => setAnchorEl(null)}
            >
                <MenuItem disabled>{username}</MenuItem>
                <Divider/>
                <LogoutButton onClick={() => setAnchorEl(null)}/>
            </Menu>}
        </React.Fragment>
    )
}

export default UserMenu
