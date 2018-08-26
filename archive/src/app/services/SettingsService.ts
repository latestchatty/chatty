declare var _:any
import {Injectable} from '@angular/core'
import {ApiService} from './ApiService'
import {ToastService} from './ToastService'

@Injectable()
export class SettingsService {
    private collapsedThreads = []
    private pinnedThreads = []
    private filteredKeywords = []
    private filteredAuthors = []
    private credentials

    constructor(private apiService:ApiService,
                private toastService:ToastService) {
        //load credentials
        let storageCredentials = localStorage.getItem('credentials')
        if (storageCredentials) {
            this.credentials = JSON.parse(storageCredentials)
        } else {
            this.credentials = {username: '', password: ''}
        }

        //load filtered things
        this.filteredAuthors = JSON.parse(localStorage.getItem('filteredAuthors') || '[]')
            .map(author => author.toLowerCase())

        this.filteredKeywords = JSON.parse(localStorage.getItem('filteredKeywords') || '[]')
            .map(keyword => new RegExp(_.escapeRegExp(keyword), 'gmi'))

        //initial load of marked posts
        this.refresh()
    }

    isCollapsed(id) {
        return this.collapsedThreads.indexOf(Number(id)) >= 0
    }

    collapseThread(id) {
        this.collapsedThreads.push(id)
        if (this.isLoggedIn()) {
            this.apiService.markPost(this.getUsername(), id, 'collapsed')
        }
    }

    uncollapseThread(id) {
        if (this.isLoggedIn() && _.includes(this.collapsedThreads, id)) {
            this.apiService.markPost(this.getUsername(), id, 'unmarked')
        }
        _.pull(this.collapsedThreads, id)
    }

    cleanCollapsed(posts) {
        _.each(this.collapsedThreads, id => {
            if (!posts[id]) {
                this.apiService.markPost(this.getUsername(), id, 'unmarked')
            }
        })
    }

    getFilteredAuthors() {
        return this.filteredAuthors
    }

    getFilteredKeywords() {
        return this.filteredKeywords
    }

    getPinned() {
        return this.pinnedThreads
    }

    pinThread(id) {
        this.pinnedThreads.push(id)
        if (this.isLoggedIn()) {
            this.apiService.markPost(this.getUsername(), id, 'pinned')
        }
    }

    unpinThread(id) {
        if (this.isLoggedIn() && _.includes(this.pinnedThreads, id)) {
            this.apiService.markPost(this.getUsername(), id, 'unmarked')
        }
        _.pull(this.pinnedThreads, id)
    }


    getUsername() {
        return this.credentials ? this.credentials.username : ''
    }

    getPassword() {
        return this.credentials.password
    }

    isLoggedIn() {
        return this.credentials.username && this.credentials.password
    }

    clearCredentials() {
        this.credentials = {username: '', password: ''}
        localStorage.removeItem('credentials')
    }

    setCredentials(username, password) {
        this.credentials = {username, password}
        localStorage.setItem('credentials', JSON.stringify(this.credentials))
    }

    refresh() {
        return this.apiService.getMarkedPosts(this.getUsername())
            .subscribe(response => {
                let markedPosts = _.get(response, 'markedPosts')
                this.collapsedThreads = _(markedPosts).filter({type: 'collapsed'}).map('id').value()
                this.pinnedThreads = _(markedPosts).filter({type: 'pinned'}).map('id').value()
            }, error => {
                console.error('Error getting marked posts: ', error)
                this.toastService.warn('Error getting marked posts.')
            })
    }
}
