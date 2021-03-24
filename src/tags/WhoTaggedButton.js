import React, {useCallback, useContext, useState} from 'react'
import Tooltip from '@material-ui/core/Tooltip'
import RecordVoiceOverOutlinedIcon from '@material-ui/icons/RecordVoiceOverOutlined'
import makeStyles from '@material-ui/styles/makeStyles'
import Popover from '@material-ui/core/Popover'
import IndicatorContext from '../context/indicators/IndicatorContext'
import {tagsById, colorByTag} from './tagData'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListSubheader from '@material-ui/core/ListSubheader'
import fetchJson from '../util/fetchJson'

const ENABLE_FEATURE = false

function WhoTaggedButton({post}) {
    const classes = useStyles()
    const [anchorEl, setAnchorEl] = useState(null)
    const [data, setData] = useState({})
    const {setLoading, showSnackbar} = useContext(IndicatorContext)

    const handleClose = () => setAnchorEl(null)

    const handleClick = useCallback(async ({currentTarget}) => {
        // TODO: Enable once API is available on WinChatty
        if (!ENABLE_FEATURE) {
            showSnackbar('This feature is under development, and will be available soon, check back later!.', {variant: 'info'})
            return null
        }

        try {
            setLoading('async')

            const result = await fetchJson(`getLolTaggers?id=${post.id}`)
            const formatted = result.reduce((acc, {tag, usernames}) => {
                const key = tagsById[tag]
                acc[key] = usernames
                return acc
            }, {})
            setData(formatted)
            setAnchorEl(currentTarget)
        } catch (err) {
            console.error('Error while getting tagger names.', err)
            showSnackbar('Error while getting tagger names. Please try again later.', {variant: 'error'})
        } finally {
            setLoading(false)
        }
    }, [post.id, setLoading, showSnackbar])

    if (post.lols.length === 0) return null
    return (
        <React.Fragment>
            <Tooltip
                disableFocusListener
                title={'Who tagged this post?'}
                enterDelay={350}
            >
                <RecordVoiceOverOutlinedIcon
                    className={classes.button}
                    onClick={handleClick}
                />
            </Tooltip>
            {
                anchorEl &&
                <Popover
                    open={true}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center'
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center'
                    }}
                >
                    <List className={classes.list} subheader={<li/>}>
                        {Object.keys(data).map(tag => (
                            <li key={`section-${tag}`} className={classes.li}>
                                <ul className={classes.ul}>
                                    <ListSubheader className={classes.bgColor}
                                                   style={{color: colorByTag[tag]}}>{tag}</ListSubheader>
                                    {data[tag].map(username => (
                                        <ListItem key={`item-${tag}-${username}`}>
                                            <ListItemText primary={username}/>
                                        </ListItem>
                                    ))}
                                </ul>
                            </li>
                        ))}
                    </List>
                </Popover>
            }
        </React.Fragment>
    )
}

const useStyles = makeStyles(theme => ({
    button: {
        width: 18,
        height: 18,
        marginTop: 1,
        cursor: 'pointer',
        color: '#fff'
    },
    list: {
        width: '100%',
        maxWidth: 400,
        backgroundColor: theme.palette.background.paper,
        position: 'relative',
        overflow: 'auto',
        maxHeight: 300
    },
    li: {
        backgroundColor: 'inherit'
    },
    ul: {
        backgroundColor: 'inherit',
        padding: 0
    }
}))

export default WhoTaggedButton
