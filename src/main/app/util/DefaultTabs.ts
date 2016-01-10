declare var _:any

export const DefaultTabs = [
    {
        displayText: 'Chatty',
        expression: thread => thread.visible = true,
        selected: true,
        defaultTab: true,
        loginRequired: false
    }, {
        displayText: 'Frontpage',
        expression: thread => thread.author === 'Shacknews',
        defaultTab: true,
        loginRequired: false,
        newPostText: 'New front page articles.',
        newPostFunction: (thread, parent, post) => thread.author === 'Shacknews'
    }, {
        displayText: 'Mine',
        expression: (thread, misc) => thread.author === misc.username,
        defaultTab: true,
        loginRequired: true
    }, {
        displayText: 'Replies',
        expression: (thread, misc) => {
            function match(it) {
                if (it.parentAuthor === misc.username) return true
                else return _.some(it.posts, post => match(post))
            }
            return match(thread)
        },
        defaultTab: true,
        loginRequired: true,
        newPostText: 'New replies to my posts.',
        newPostFunction: (thread, parent, post, misc) => post.parentAuthor === misc.username
    }
]
