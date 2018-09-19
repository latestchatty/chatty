import React from 'react'
import Tooltip from '@material-ui/core/Tooltip'
import LabelIcon from '@material-ui/icons/Label'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import withAuth from '../context/auth/withAuth'
import withIndicators from '../context/indicators/withIndicators'
import querystring from 'querystring'

class TagButton extends React.PureComponent {
    state = {open: false}

    handleClick = event => this.setState({open: true, anchorEl: event.target})
    handleClose = () => this.setState({open: false, anchorEl: null})

    handleTag = tag => async () => {
        const {setLoading, username, postId} = this.props
        try {
            setLoading('async')
            this.setState({open: false})

            let text = await this.tagPost(username, postId, tag)
            if (text.includes('already tagged')) {
                text = await this.tagPost(username, postId, tag, 'untag')
            }
            if (!text.match(/^ok /)) {
                console.warn('Error tagging post', text)
            }
        } catch (err) {
            console.error('Exception while tagging post', err)
        } finally {
            setLoading(false)
        }
    }

    async tagPost(who, what, tag, action) {
        const base = 'http://www.lmnopc.com/greasemonkey/shacklol/report.php'
        const params = querystring.stringify({who, what, tag, version: '-1'})
        if (action) params.action = action
        const response = await fetch(`${base}?${params}`)
        return response.text()
    }

    render() {
        const {className, isLoggedIn} = this.props
        const {anchorEl, open} = this.state

        if (!isLoggedIn) return null
        return (
            <React.Fragment>
                <Tooltip disableFocusListener title='Tag Post' enterDelay={350}>
                    <LabelIcon className={className} onClick={this.handleClick}/>
                </Tooltip>

                {
                    open && <Menu
                        keepMounted
                        open={open}
                        anchorEl={anchorEl}
                        onClose={this.handleClose}
                    >
                        <MenuItem onClick={this.handleTag('LOL')}>LOL</MenuItem>
                        <MenuItem onClick={this.handleTag('INF')}>INF</MenuItem>
                        <MenuItem onClick={this.handleTag('UNF')}>UNF</MenuItem>
                        <MenuItem onClick={this.handleTag('WTF')}>WTF</MenuItem>
                    </Menu>
                }
            </React.Fragment>
        )
    }
}

export default withAuth(
    withIndicators(
        TagButton
    )
)
