import React, {useContext, useState} from 'react'
import Tooltip from '@material-ui/core/Tooltip'
import LabelIcon from '@material-ui/icons/Label'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import querystring from 'querystring'
import AuthContext from '../context/auth/AuthContext'
import supportedTags from './supportedTags'
import IndicatorContext from '../context/indicators/IndicatorContext'

function TagButton({className, postId}) {
    const {isLoggedIn, username} = useContext(AuthContext)
    const {setLoading, showSnackbar} = useContext(IndicatorContext)
    const [anchorEl, setAnchorEl] = useState(null)

    const tags = supportedTags.map(tag => tag.toUpperCase())

    const handleTag = async tag => {
        try {
            setLoading('async')
            setAnchorEl(null)

            let text = await tagPost(username, postId, tag)
            if (text.includes('already tagged')) {
                text = await tagPost(username, postId, tag, 'untag')
            }
            if (!text.match(/^ok /)) {
                console.warn('Error tagging post', text)
            }
        } catch (err) {
            console.error('Exception while tagging post', err)
            showSnackbar('Error while tagging post. Please try again later.', {variant: 'error'})
        } finally {
            setLoading(false)
        }
    }

    const tagPost = async (who, what, tag, action) => {
        const base = 'https://lol.lmnopc.com/report.php'
        const params = {who, what, tag, version: -1}
        if (action) params.action = action
        const response = await fetch(`${base}?${querystring.stringify(params)}`, {method: 'POST'})
        return response.text()
    }

    if (!isLoggedIn) return null
    return (
        <React.Fragment>
            <Tooltip disableFocusListener title='Tag Post' enterDelay={350}>
                <LabelIcon className={className} onClick={event => setAnchorEl(event.target)}/>
            </Tooltip>

            {
                anchorEl && <Menu
                    keepMounted
                    open={!!anchorEl}
                    anchorEl={anchorEl}
                    onClose={() => setAnchorEl(null)}
                >
                    {tags.map(tag => <MenuItem key={tag} onClick={() => handleTag(tag)}>{tag}</MenuItem>)}
                </Menu>
            }
        </React.Fragment>
    )
}

export default TagButton
