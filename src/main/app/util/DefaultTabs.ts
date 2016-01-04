declare var _:any

export const DefaultTabs = [
    {
        displayText: 'Chatty',
        expression: thread => thread.visible = true,
        selected: true,
        defaultTab: true
    }, {
        displayText: 'Frontpage',
        expression: thread => thread.author === 'Shacknews',
        defaultTab: true,
        newPostText: 'New front page articles.',
        //newPostFunction: (thread, parent, post) => post.author === 'Shacknews'
    }, {
        displayText: 'Mine',
        expression: (thread, misc) => thread.author === misc.username,
        defaultTab: true,
        //newPostFunction: () => false
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
        newPostText: 'New replies to my posts.',
        //newPostFunction: (thread, parent, post, misc) => post.parentAuthor === misc.username
    }
]
