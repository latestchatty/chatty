import React, {useContext, useMemo} from 'react'
import classnames from 'classnames'
import AuthContext from '../context/auth/AuthContext'
import {makeStyles} from '@material-ui/styles'

function PostAuthor({post = {}, thread = {}}) {
    const classes = useStyles()
    const {username} = useContext(AuthContext)
    const {author = ''} = post

    const isSameUser = (one = '', two = '') => {
        const left = one.toLowerCase().replace(/\s/g, '')
        const right = two.toLowerCase().replace(/\s/g, '')
        return left === right
    }

    const userClass = useMemo(() => {
        if (username && isSameUser(author, username)) return 'self'
        else if (thread.id !== post.id && isSameUser(thread.author, author)) return 'op'
        else if (employees.find(employee => isSameUser(employee, author))) return 'employee'
        else if (mods.find(mod => isSameUser(mod, author))) return 'mod'
        return 'normal'
    }, [username, author, thread.id, post.id, thread.author])

    // Don't let the browser line break in the middle of author name
    const nonBreakingAuthor = useMemo(() => author.replace(/\s/g, String.fromCharCode(160)), [author])

    return (
        <span className={classnames(classes.user, classes[userClass])}>
            {nonBreakingAuthor}
        </span>
    )
}

const employees = [
    'themanwiththebriefcase',
    'shacknews'
]
const mods = []

const useStyles = makeStyles({
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
})

export default PostAuthor
