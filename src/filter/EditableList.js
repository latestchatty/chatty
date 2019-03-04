import React, {useContext, useState} from 'react'
import IconButton from '@material-ui/core/IconButton'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import Typography from '@material-ui/core/Typography'
import DeleteIcon from '@material-ui/icons/Delete'
import CheckIcon from '@material-ui/icons/Check'
import CloseIcon from '@material-ui/icons/Close'
import AddIcon from '@material-ui/icons/Add'
import TextField from '@material-ui/core/TextField'
import {makeStyles} from '@material-ui/styles'
import classnames from 'classnames'
import IndicatorContext from '../context/indicators/IndicatorContext'

function EditableList({title, value, onChange}) {
    const classes = useStyles()
    const [editing, setEditing] = useState(false)
    const [itemText, setItemText] = useState('')
    const {showSnackbar} = useContext(IndicatorContext)

    const addItem = () => {
        try {
            if (itemText.length) {
                const regex = new RegExp(itemText, 'gmi')
                const newItem = {text: itemText, regex}
                onChange && onChange(value.concat([newItem]))
                setEditing(false)
                setItemText('')
            }
        } catch (ex) {
            showSnackbar('Invalid filter term.')
        }
    }
    const removeItem = itemToRemove => onChange && onChange(value.filter(item => item !== itemToRemove))

    return (
        <div className={classes.container}>
            <div className={classes.row}>
                {
                    editing ?
                        <React.Fragment>
                            <TextField
                                placeholder={`Add new ${title.toLowerCase()}`}
                                margin='none'
                                autoFocus
                                className={classes.fill}
                                value={itemText}
                                onKeyPress={event => event.key === 'Enter' && addItem(itemText)}
                                onChange={event => setItemText(event.target.value)}
                            />
                            <IconButton onClick={() => addItem()}>
                                <CheckIcon fontSize='small'/>
                            </IconButton>
                            <IconButton onClick={() => setEditing(false)}>
                                <CloseIcon fontSize='small'/>
                            </IconButton>
                        </React.Fragment>
                        :
                        <React.Fragment>
                            <Typography variant='subtitle1' className={classnames(classes.title, classes.fill)}>
                                {title}s
                            </Typography>

                            <IconButton disableRipple onClick={() => setEditing(true)}>
                                <AddIcon fontSize='small'/>
                            </IconButton>
                        </React.Fragment>
                }
            </div>
            <List dense>
                {
                    value.length === 0 &&
                    <ListItem dense>
                        <ListItemText primary='List is empty.'/>
                    </ListItem>
                }
                {value.length > 0 && value.map((item, key) =>
                    <ListItem key={key} dense>
                        <ListItemText primary={item.text}/>
                        <ListItemSecondaryAction>
                            <IconButton onClick={() => removeItem(item)}>
                                <DeleteIcon fontSize='small'/>
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                )}
            </List>
        </div>
    )
}

const useStyles = makeStyles({
    row: {
        display: 'flex',
        flexDirection: 'row'
    },
    fill: {
        display: 'flex',
        flex: 1
    },
    container: {
        marginTop: 12
    },
    title: {
        marginTop: 6
    }
})

export default EditableList
