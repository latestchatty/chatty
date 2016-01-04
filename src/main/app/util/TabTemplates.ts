export const TabTemplates = {
    user: function(value) {
        return {
            tabType: 'user',
            value: value,
            displayText: value,
            expression: {author: value},
            newPostText: 'New replies in threads participated in by this user.',
            newPostFunction: (thread, parent, post) => {
                //TODO fix tabs
                //return post.author === this.displayText
            }
        }
    },
    filter: function(value) {
        return {
            tabType: 'filter',
            value: value,
            displayText: value,
            expression: {$: value},
            newPostText: 'New posts containing this search term.'
        }
    }
}
