import React, {useContext, useEffect, useState} from 'react'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import MessageIcon from '@material-ui/icons/Message'
import Badge from '@material-ui/core/Badge'
import {makeStyles} from '@material-ui/styles'
import fetchJson from '../util/fetchJson'
import AuthContext from '../context/auth/AuthContext'

function MessagesButton() {
    const classes = useStyles()
    const {isLoggedIn, username, password} = useContext(AuthContext)

    const [totalMessagesCount, setTotalMessagesCount] = useState(0)
    const [unreadMessagesCount, setUnreadMessagesCount] = useState(0)

    const displayBadge = unreadMessagesCount > 0
    const title = `( ${unreadMessagesCount} / ${totalMessagesCount} ) unread messages`

    const getCounts = async () => {
        if (isLoggedIn) {
            const options = {method: 'POST', body: {username, password}}
            const {total, unread} = await fetchJson('getMessageCount', options)
            setTotalMessagesCount(total)
            setUnreadMessagesCount(unread)
        }
    }

    // update counts every 15 minutes
    useEffect(() => {
        getCounts()

        const id = setInterval(() => getCounts(), 15 * 60 * 1000)
        return () => clearInterval(id)
    }, [isLoggedIn])

    if (!isLoggedIn) return null
    return (
        <Tooltip disableFocusListener title={title} enterDelay={350}>
            <IconButton href='https://www.shacknews.com/messages' target='_blank'>
                {
                    displayBadge
                        ? <Badge
                            badgeContent={unreadMessagesCount}
                            color='secondary'
                            classes={{badge: classes.badge}}
                        >
                            <MessageIcon/>
                        </Badge>
                        : <MessageIcon/>
                }
            </IconButton>
        </Tooltip>
    )
}

const useStyles = makeStyles({
    badge: {
        top: 12
    }
})

export default MessagesButton
