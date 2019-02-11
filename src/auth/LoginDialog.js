import React, {useContext, useState} from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import AuthContext from '../context/auth/AuthContext'
import IndicatorContext from '../context/indicators/IndicatorContext'

function LoginDialog({open, onClose}) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const {login} = useContext(AuthContext)
    const {setLoading} = useContext(IndicatorContext)

    const submit = async event => {
        event.preventDefault()

        try {
            setLoading('sync')

            await login(username, password)

            setUsername('')
            setPassword('')
            onClose()
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onClose={onClose}>
            <form onSubmit={submit}>
                <DialogTitle>Log in</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin='dense'
                        label='Username'
                        type='text'
                        fullWidth
                        onChange={event => setUsername(event.target.value)}
                    />
                    <TextField
                        margin='dense'
                        label='Password'
                        type='password'
                        fullWidth
                        onChange={event => setPassword(event.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type='submit'>Log in</Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}

export default LoginDialog
