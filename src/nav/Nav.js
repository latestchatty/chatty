import React from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import {withStyles} from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import UserMenu from '../userMenu/UserMenu'
import RefreshButton from './RefreshButton'
import NewThreadButton from './NewThreadButton'
import MessagesButton from './MessagesButton'

class Nav extends React.Component {
    render() {
        const {classes} = this.props

        return (
            <React.Fragment>
                <AppBar elevation={0}>
                    <Toolbar>
                        <IconButton className={classes.menuButton} onClick={this.openDrawer}>
                            <MenuIcon className={classes.white}/>
                        </IconButton>

                        <Typography variant='headline' className={classes.title}>Chatty</Typography>

                        <NewThreadButton/>
                        <MessagesButton/>
                        <RefreshButton/>
                        <UserMenu/>
                    </Toolbar>
                </AppBar>
            </React.Fragment>
        )
    }
}

const styles = {
    white: {
        color: '#fff'
    },
    title: {
        color: '#fff',
        flex: 1
    },
    menuButton: {
        marginLeft: -15,
        marginRight: 8
    }
}

export default withStyles(styles)(Nav)
