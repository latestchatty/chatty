import React from 'react'
import Button from '@material-ui/core/Button'
import LoginDialog from './LoginDialog'

class LoginButton extends React.PureComponent {
    state = {open: false}

    handleClick = () => this.setState({open: true})
    handleClose = () => this.setState({open: false})

    render() {
        const {open} = this.state

        return (
            <React.Fragment>
                <Button onClick={this.handleClick}>Log in</Button>

                <LoginDialog
                    open={open}
                    onClose={this.handleClose}
                />
            </React.Fragment>
        )
    }
}

export default LoginButton
