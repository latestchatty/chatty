declare var _ : any
import {Injectable} from 'angular2/core'
import {ApiService} from './ApiService'

@Injectable()
export class SettingsService {
    private collapsedThreads = []
    private pinnedThreads = []
    private credentials

    constructor(private apiService:ApiService){
        let storageCredentials = localStorage.getItem('credentials')
        if (storageCredentials) {
            this.credentials = JSON.parse(storageCredentials)
        } else {
            this.credentials = {username: '', password: ''}
        }
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
        if (this.isLoggedIn() && _.contains(this.collapsedThreads, id)) {
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

    getPinned() {
        return this.pinnedThreads
    }

    isPinned(id) {
        return this.pinnedThreads.indexOf(Number(id)) >= 0
    }

    pinThread(id) {
        this.pinnedThreads.push(id)
        if (this.isLoggedIn()) {
            this.apiService.markPost(this.getUsername(), id, 'pinned')
        }
    }

    unpinThread(id) {
        if (this.isLoggedIn() && _.contains(this.pinnedThreads, id)) {
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
        this.credentials.username = ''
        this.credentials.password = ''
        localStorage.removeItem('credentials')
    }

    setCredentials(username, password) {
        this.credentials.username = username
        this.credentials.password = password
        localStorage.setItem('credentials', this.credentials)
    }

    refresh() {
        return this.apiService.getMarkedPosts(this.getUsername())
            .then(response => {
                this.collapsedThreads = []
                this.pinnedThreads = []
                _.each(response.data.markedPosts, mark => {
                    if (mark.type === 'collapsed') {
                        this.collapsedThreads.push(mark.id)
                    } else if (mark.type === 'pinned') {
                        this.pinnedThreads.push(mark.id)
                    }
                })
            })
            .catch(response => console.error('Error getting marked posts: ', response))
    }
}
