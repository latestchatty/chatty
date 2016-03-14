declare var _:any

export const DefaultTabs = [
    {
        displayText: 'Chatty',
        hoverText: 'All chatty threads.',
        expression: thread => thread.visible = true,
        selected: true,
        defaultTab: true,
        loginRequired: false
    }, {
        displayText: 'Frontpage',
        hoverText: 'Front page articles.',
        expression: thread => thread.author === 'Shacknews',
        defaultTab: true,
        loginRequired: false
    }, {
        displayText: 'Mine',
        hoverText: 'Threads created by you.',
        expression: (thread, misc) => thread.author === misc.username,
        defaultTab: true,
        loginRequired: true
    }, {
        displayText: 'Replies',
        hoverText: 'Threads containing replies to you.',
        expression: (thread, misc) => {
            function match(it) {
                if (it.parentAuthor === misc.username) return true
                else return _.some(it.posts, post => match(post))
            }
            return match(thread)
        },
        defaultTab: true,
        loginRequired: true,
        newPostFunction: (thread, parent, post, misc) => post.parentAuthor === misc.username
    }
]
