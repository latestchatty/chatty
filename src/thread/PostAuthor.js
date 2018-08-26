import React from 'react'
import {withStyles} from '@material-ui/core/styles'
import withAuth from '../context/auth/withAuth'
import classnames from 'classnames'

class PostAuthor extends React.PureComponent {
    render() {
        const {classes, post = {}, username} = this.props
        const {author = '', thread = {}} = post

        let userClass = 'normal'
        if (username && isSameUser(author, username)) userClass = 'self'
        else if (thread.id !== post.id && isSameUser(thread.author, author)) userClass = 'op'
        else if (employees.find(employee => isSameUser(employee, author))) userClass = 'employee'
        else if (mods.find(mod => isSameUser(mod, author))) userClass = 'mod'

        return <span className={classnames(classes.user, classes[userClass])}>{author}</span>
    }
}

const isSameUser = (one = '', two = '') => {
    const left = one.toLowerCase().replace(/\s/g, '')
    const right = two.toLowerCase().replace(/\s/g, '')
    return left === right
}

const employees = [
    'themanwiththebriefcase',
    'shacknews'
]
const mods = []

const styles = {
    user: {
        fontSize: 14,
        fontWeight: 'bold',
        cursor: 'pointer',
        '&:hover': {
            textDecoration: 'underline'
        }
    },
    normal: {
        color: '#f3e7b5'
    },
    self: {
        color: '#6cf'
    },
    op: {
        color: '#6aff94'
    },
    mod: {
        color: '#d20000'
    },
    employee: {
        color: '#9370db'
    }
}

export default withAuth(withStyles(styles)(PostAuthor))
