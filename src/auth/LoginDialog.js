import React from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import withAuth from '../context/auth/withAuth'

class LoginDialog extends React.Component {
    state = {
        username: '',
        password: ''
    }

    handleChange = event => this.setState({[event.target.id]: event.target.value})
    handleSubmit = async event => {
        event.preventDefault()
        const {username, password} = this.state
        const {login, onClose} = this.props
        login(username, password)
        this.setState({username: '', password: ''})
        onClose()
    }

    render() {
        const {open, onClose} = this.props
        return (
            <Dialog open={open} onClose={onClose}>
                <form onSubmit={this.handleSubmit}>
                    <DialogTitle>Log in</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin='dense'
                            id='username'
                            label='Username'
                            type='text'
                            fullWidth
                            onChange={this.handleChange}
                        />
                        <TextField
                            margin='dense'
                            id='password'
                            label='Password'
                            type='password'
                            fullWidth
                            onChange={this.handleChange}
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
}

export default withAuth(LoginDialog)
