import React, { useState } from 'react'
import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications'
import Tooltip from '@material-ui/core/Tooltip/Tooltip'
import { makeStyles } from '@material-ui/styles'
import AppSettingsDialog from './AppSettingsDialog'

function AppSettingsMenuItem() {
	const classes = useStyles()

	const [open, setOpen] = useState(false)
	const [rendered, setRendered] = useState(false)
	return (
		<React.Fragment>
			<Tooltip disableFocusListener title='Filter Settings' enterDelay={350}>
				<div className={classes.container} onClick={() => setOpen(true) || setRendered(true)}>
					<SettingsApplicationsIcon />&nbsp;Application Settings
				</div>
			</Tooltip>

			{rendered && <AppSettingsDialog open={open} onClose={() => setOpen(false)} />}
		</React.Fragment>
	)
}

const useStyles = makeStyles({
	container: {
		display: 'flex',
		alignItems: 'center'
	}
})

export default AppSettingsMenuItem
