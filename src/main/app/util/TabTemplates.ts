export const TabTemplates = {
    user: value => {
        return {
            tabType: 'user',
            value: value,
            displayText: value,
            expression: value,
            newPostText: 'New replies in threads participated in by this user.',
            //newPostFunction: (thread, parent, post) => {
                //TODO fix tabs
                //return post.author === this.displayText
            //}
        }
    },
    filter: value => {
        return {
            tabType: 'filter',
            value: value,
            displayText: value,
            expression: {$: value},
            //newPostText: 'New posts containing this search term.'
        }
    }
}
