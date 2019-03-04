import React from 'react'
import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import {makeStyles} from '@material-ui/styles'

function FilterCheckbox({label, checked, onChange}) {
    const classes = useStyles()
    return (
        <FormControlLabel
            label={label}
            className={classes.checkbox}
            control={
                <Checkbox
                    checked={checked}
                    onChange={onChange}
                />
            }
        />
    )
}

const useStyles = makeStyles({
    checkbox: {
        marginBottom: -12
    }
})

export default FilterCheckbox
