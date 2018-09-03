import React from 'react'
import IconButton from '@material-ui/core/IconButton'
import AddIcon from '../../node_modules/@material-ui/icons/Add'
import Tooltip from '@material-ui/core/Tooltip'
import withAuth from '../context/auth/withAuth'
import Dialog from '@material-ui/core/Dialog'
import ReplyBox from '../replyBox/ReplyBox'
import {withStyles} from '@material-ui/core/styles'

class NewThreadButton extends React.Component {
    state = {open: false}

    handleClick = () => this.setState({open: true})
    handleClose = () => this.setState({open: false})

    render() {
        const {classes, isLoggedIn} = this.props
        const {open} = this.state
        if (!isLoggedIn) return null

        return (
            <React.Fragment>
                <Tooltip disableFocusListener title='New Thread' enterDelay={350}>
                    <IconButton onClick={this.handleClick}>
                        <AddIcon/>
                    </IconButton>
                </Tooltip>
                <Dialog
                    open={open}
                    onClose={this.handleClose}
                    classes={{paper: classes.dialogPaper}}
                >
                    <ReplyBox
                        parentId={0}
                        onCloseReplyBox={this.handleClose}
                    />
                </Dialog>
            </React.Fragment>
        )
    }
}

const styles = {
    dialogPaper: {
        width: '85vw'
    }
}

export default withAuth(
    withStyles(styles)(
        NewThreadButton
    )
)
