import React from 'react'
import Snackbar from '@material-ui/core/Snackbar'

function Snackbars({snackbars, setSnackbars}) {
    const handleClose = () => setSnackbars(snackbars.slice(1))
    let open = false
    let message = ''
    if (snackbars.length) {
        open = true
        message = snackbars[0]
    }
    return (
        <Snackbar
            anchorOrigin={{vertical: 'top', horizontal: 'center'}}
            autoHideDuration={6000}
            open={open}
            onClose={handleClose}
            onExited={handleClose}
            message={<span>{message}</span>}
        />
    )
}

export default Snackbars
