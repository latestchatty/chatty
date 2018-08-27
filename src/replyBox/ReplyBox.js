import React from 'react'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import {withStyles} from '@material-ui/core/styles'
import Input from '@material-ui/core/Input'
import fetchJson from '../util/fetchJson'
import withAuth from '../context/auth/withAuth'
import querystring from 'querystring'
import withIndicators from '../context/indicators/withIndicators'

class ReplyBox extends React.Component {
    state = {
        text: '',
        posting: false
    }

    handleChange = event => this.setState({text: event.target.value})

    handleSubmit = async () => {
        const {setLoading, username, password, parentId} = this.props
        const {text} = this.state
        try {
            setLoading('async')
            this.setState({posting: true})
            let response = await fetchJson('postComment', {
                method: 'POST',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                body: querystring.stringify({username, password, parentId, text})
            })
            if (response.result === 'success') {
                this.props.onCloseReplyBox()
                // TODO: toast user
            }
        } catch (ex) {
            console.log('Error while posting comment', ex)
            // TODO: toast user
            return false
        } finally {
            this.setState({posting: false})
            setLoading(false)
        }
    }

    render() {
        const {classes, onCloseReplyBox} = this.props
        const {posting, text} = this.state

        return (
            <Card className={classes.card}>
                <CardContent>
                    <div className={classes.flexRow}>
                        <Input
                            multiline
                            autoFocus
                            disableUnderline
                            rows={5}
                            fullWidth
                            className={classes.textarea}
                            placeholder='Type something interesting...'
                            name='replyBody'
                            required
                            onChange={this.handleChange}
                        />
                    </div>
                </CardContent>
                <CardActions className={classes.actions}>
                    <Button
                        color='primary'
                        variant='outlined'
                        disabled={posting || !text.length}
                        onClick={this.handleSubmit}
                    >Post
                    </Button>
                    <Button
                        variant='outlined'
                        onClick={onCloseReplyBox}
                    >Cancel
                    </Button>
                </CardActions>
            </Card>
        )
    }
}

const styles = {
    card: {
        backgroundColor: '#202224',
        marginTop: -3,
        borderRadius: 0,
        border: '1px solid #656565'
    },
    actions: {
        margin: '-8px 0 8px 8px'
    },
    flexRow: {
        display: 'flex',
        flexDirection: 'row'
    },
    textarea: {
        flex: 1,
        backgroundColor: '#000',
        padding: 4
    }
}

export default withAuth(
    withIndicators(
        withStyles(styles)(ReplyBox)
    )
)
