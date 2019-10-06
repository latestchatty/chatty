import React, {useState} from 'react'
import IconButton from '@material-ui/core/IconButton/IconButton'
import SettingsIcon from '@material-ui/icons/Settings'
import Tooltip from '@material-ui/core/Tooltip/Tooltip'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import FilterMenuItem from '../filter/FilterMenuItem'
import AppSettingsMenuItem from './AppSettingsMenuItem'

function SettingsButton() {
	 const [anchorEl, setAnchorEl] = useState(null)
	 
    return (
        <React.Fragment>
            <Tooltip disableFocusListener title='App Settings' enterDelay={350}>
                <IconButton onClick={event => setAnchorEl(event.target)}>
                    <SettingsIcon/>
                </IconButton>
            </Tooltip>

				{
                <Menu
                    keepMounted
                    open={!!anchorEl}
                    anchorEl={anchorEl}
                    onClose={() => setAnchorEl(null)}
                >
                    <MenuItem key='filterSettings'><FilterMenuItem/></MenuItem>)}
						  <MenuItem key='appSettings'><AppSettingsMenuItem/></MenuItem>
                </Menu>
            }
        </React.Fragment>
    )
}

export default SettingsButton
