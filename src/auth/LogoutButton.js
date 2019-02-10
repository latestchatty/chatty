import React, {useContext} from 'react'
import MenuItem from '@material-ui/core/MenuItem'
import AuthContext from '../context/auth/AuthContext'

function LoginButton({onClick}) {
    const {logout} = useContext(AuthContext)
    const handleClick = () => {
        onClick && onClick()
        logout()
    }
    return <MenuItem onClick={handleClick}>Logout</MenuItem>
}

export default LoginButton
