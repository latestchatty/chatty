import React, { useState } from 'react'
import FilterListIcon from '@material-ui/icons/FilterList';
import Tooltip from '@material-ui/core/Tooltip/Tooltip'
import FilterDialog from '../filter/FilterDialog'
import { makeStyles } from '@material-ui/styles'

function FilterMenuItem() {
	const classes = useStyles()

	const [open, setOpen] = useState(false)
	const [rendered, setRendered] = useState(false)
	return (
		<React.Fragment>
			<Tooltip disableFocusListener title='Filter Settings' enterDelay={350}>
				<div className={classes.container} onClick={() => setOpen(true) || setRendered(true)}>
					<FilterListIcon />&nbsp;Filter Settings
				</div>
			</Tooltip>

			{rendered && <FilterDialog open={open} onClose={() => setOpen(false)} />}
		</React.Fragment>
	)
}

const useStyles = makeStyles({
	container: {
		display: 'flex',
		alignItems: 'center'
	}
})

export default FilterMenuItem
