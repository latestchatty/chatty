import React, {useState} from 'react'
import Button from '@material-ui/core/Button'
import LoginDialog from './LoginDialog'

function LoginButton() {
    const [open, setOpen] = useState(false)
    return (
        <React.Fragment>
            <Button onClick={() => setOpen(true)}>Log in</Button>

            <LoginDialog open={open} onClose={() => setOpen(false)}/>
        </React.Fragment>
    )
}

export default LoginButton
