import {Filter} from './Filter'

export const TabTemplates = {
    user: value => {
        return {
            tabType: 'user',
            value: value,
            displayText: value,
            expression: value,
            hoverText: 'Posts and replies by this user.',
            newPostFunction: (thread, parent, post) => post.author === this.displayText
        }
    },
    filter: value => {
        return {
            tabType: 'filter',
            value: value,
            displayText: value,
            expression: value,
            hoverText: 'Posts containing this search term.',
            newPostFunction: (thread, parent, post) => Filter.filter([post], value).length > 0
        }
    }
}
