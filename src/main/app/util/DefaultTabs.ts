export default [
    {
        displayText: 'Chatty',
        expression: null,
        selected: true,
        defaultTab: true
    }, {
        displayText: 'Frontpage',
        expression: {author: 'Shacknews'},
        defaultTab: true,
        newPostText: 'New front page articles.',
        newPostFunction: (thread, parent, post) => post.author === 'Shacknews'
    }, {
        displayText: 'Mine',
        //expression: () => ({$: {author: settingsService.getUsername()}}),
        defaultTab: true,
        newPostFunction: () => false
    }, {
        displayText: 'Replies',
        //expression: () => ({$: {author: settingsService.getUsername()}}),
        defaultTab: true,
        newPostText: 'New replies to my posts.',
        //newPostFunction: (thread, parent, post) => post.parentAuthor === settingsService.getUsername()
    }
]
