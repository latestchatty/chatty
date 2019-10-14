import React, {useContext, useState} from 'react'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import Input from '@material-ui/core/Input'
import fetchJson from '../util/fetchJson'
import classnames from 'classnames'
import AuthContext from '../context/auth/AuthContext'
import IndicatorContext from '../context/indicators/IndicatorContext'
import {makeStyles} from '@material-ui/styles'

function ReplyBox({onCloseReplyBox, parentId, className}) {
    const classes = useStyles()
    const {username, password} = useContext(AuthContext)
    const {setLoading, showSnackbar} = useContext(IndicatorContext)
    const [text, setText] = useState('')
    const [posting, setPosting] = useState(false)

    const handleSubmit = async () => {
        try {
            setLoading('async')
            setPosting(true)
            let response = await fetchJson('postComment', {method: 'POST', body: {username, password, parentId, text}})
            if (response.result === 'success') {
                onCloseReplyBox()
            }
        } catch (ex) {
            console.log('Error while posting comment', ex)
            showSnackbar('Error while posting. Please try again later.', {variant: 'error'})
            setPosting(false)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className={classnames(className, classes.card)}>
            {parentId === 0 && <CardHeader title='New Thread'/>}
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
                        disabled={posting}
                        onChange={event => setText(event.target.value)}
                    />
                </div>
            </CardContent>
            <CardActions className={classes.actions}>
                <Button
                    color='primary'
                    variant='outlined'
                    disabled={posting || !text.length}
                    onClick={handleSubmit}
                >Post
                </Button>
                <Button
                    variant='outlined'
                    disabled={posting}
                    onClick={onCloseReplyBox}
                >Cancel
                </Button>
            </CardActions>
        </Card>
    )
}

const useStyles = makeStyles({
    card: {
        backgroundColor: '#202224',
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
})

export default ReplyBox
