import React from 'react'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import Dialog from '@material-ui/core/Dialog'
import Button from '@material-ui/core/Button'
import withFilter from '../context/filter/withFilter'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import {withStyles} from '@material-ui/core/styles'

class FilterDialog extends React.Component {
    state = {}

    componentDidMount() {
        this.setState({...this.props.filterSettings})
    }

    handleChange = name => event => this.setState({[name]: event.target.checked})
    handleSave = () => {
        this.props.onClose()
        this.props.updateFilterSettings(this.state)
    }

    render() {
        const {classes, open, onClose} = this.props
        const {showCollapsed} = this.state

        return (
            <Dialog open={open} onClose={onClose}>
                <DialogTitle>Filter Threads/Posts</DialogTitle>
                <DialogContent className={classes.content}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={showCollapsed}
                                onChange={this.handleChange('showCollapsed')}
                                value='showCollapsed'
                            />
                        }
                        label='Show Collapsed Threads'
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.props.onClose}>Cancel</Button>
                    <Button onClick={this.handleSave}>Save</Button>
                </DialogActions>
            </Dialog>
        )
    }
}

const styles = {
    content: {
        display: 'flex',
        flexDirection: 'column'
    }
}

export default withFilter(
    withStyles(styles)(
        FilterDialog
    )
)
