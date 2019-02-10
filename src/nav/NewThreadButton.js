import React, {useContext, useState} from 'react'
import IconButton from '@material-ui/core/IconButton'
import AddIcon from '../../node_modules/@material-ui/icons/Add'
import Tooltip from '@material-ui/core/Tooltip'
import Dialog from '@material-ui/core/Dialog'
import ReplyBox from '../replyBox/ReplyBox'
import {withStyles} from '@material-ui/core/styles'
import AuthContext from '../context/auth/AuthContext'

function NewThreadButton({classes}) {
    const {isLoggedIn} = useContext(AuthContext)
    const [open, setOpen] = useState(false)
    if (!isLoggedIn) return null

    return (
        <React.Fragment>
            <Tooltip disableFocusListener title='New Thread' enterDelay={350}>
                <IconButton onClick={() => setOpen(true)}>
                    <AddIcon/>
                </IconButton>
            </Tooltip>
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                classes={{paper: classes.dialogPaper}}
            >
                <ReplyBox
                    parentId={0}
                    onCloseReplyBox={() => setOpen(false)}
                />
            </Dialog>
        </React.Fragment>
    )
}

const styles = {
    dialogPaper: {
        width: '85vw'
    }
}

export default withStyles(styles)(NewThreadButton)
