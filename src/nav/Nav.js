import React, {useState} from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import {withStyles} from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import UserMenu from '../userMenu/UserMenu'
import RefreshButton from './RefreshButton'
import NewThreadButton from './NewThreadButton'
import MessagesButton from './MessagesButton'
import FilterButton from '../filter/FilterButton'
import Drawer from '@material-ui/core/Drawer'

function Nav({classes}) {
    const [drawerOpen, setDrawerOpen] = useState(false)
    const closeDrawer = () => setDrawerOpen(false)

    return (
        <React.Fragment>
            <AppBar elevation={0}>
                <Toolbar>
                    <IconButton className={classes.menuButton} onClick={() => setDrawerOpen(!drawerOpen)}>
                        <MenuIcon className={classes.white}/>
                    </IconButton>

                    <Typography variant="h5" className={classes.title}>Chatty</Typography>

                    <FilterButton/>
                    <NewThreadButton/>
                    <MessagesButton/>
                    <RefreshButton/>
                    <UserMenu/>
                </Toolbar>
            </AppBar>

            <Drawer open={drawerOpen} onClose={closeDrawer} className={classes.drawer}>
                <AppBar position="static" color="primary" className={classes.drawerAppBar}>
                    <Toolbar>
                        <Typography variant="h6" className={classes.title}>Latest Chatty</Typography>
                    </Toolbar>
                </AppBar>

                <a href="https://github.com/latestchatty/chatty" className={classes.menuItem}>
                    <MenuItem onClick={closeDrawer}>Contribute</MenuItem>
                </a>
                <a href="https://github.com/latestchatty/chatty/issues" className={classes.menuItem}>
                    <MenuItem onClick={closeDrawer}>Feedback</MenuItem>
                </a>
            </Drawer>
        </React.Fragment>
    )
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
    },
    menuItem: {
        textDecoration: 'none',
        color: 'inherit'
    }
}

export default withStyles(styles)(Nav)
