declare var _ : any
import {Injectable} from '@angular/core'
import {ApiService} from './ApiService'
import {ServerErrors} from '../util/ServerErrors'
import {SettingsService} from './SettingsService'
import {ToastService} from './ToastService'

@Injectable()
export class PostService {
    private posting = false
    private lastTimeout = null
    private postQueue = []

    constructor(private apiService:ApiService,
                private settingsService:SettingsService,
                private toastService:ToastService) {
    }

    getQueue() {
        return this.postQueue
    }

    clearQueue() {
        clearTimeout(this.lastTimeout)
        this.posting = false

        while (this.postQueue.length) {
            this.postQueue.pop()
        }
    }

    submitPost(parentId, body) {
        this.postQueue.push({parentId: parentId, body: body})

        if (!this.posting) {
            setTimeout(() => this.startPosting())
        }
    }

    private postToApi(post) {
        var user = this.settingsService.getUsername()
        var pass = this.settingsService.getPassword()
        return this.apiService.submitPost(user, pass, post.parentId, post.body)
            .then(response => {
                var result = _.get(response, 'result')
                if (result !== 'success') {
                    Promise.reject(response)
                }
                return response
            })
    }

    private startPosting() {
        if (this.settingsService.isLoggedIn() && this.postQueue.length) {
            this.posting = true

            var post = this.postQueue[0]
            this.postToApi(post)
                .then(() => {
                    _.pull(this.postQueue, post)
                    this.startPosting()
                })
                .catch(response => {
                    if (response && response.error && response.code === 'ERR_INVALID_LOGIN') {
                        let msg = 'Error creating post: Invalid login'
                        console.log(msg, response)
                        this.toastService.warn(msg)

                        this.settingsService.clearCredentials()
                        this.clearQueue()
                    } else if (_.get(response, 'error') && _.includes(_.keys(ServerErrors), response.code)) {
                        let msg = `Error creating post: ${ServerErrors[response.code]}`
                        console.error(msg, response)
                        this.toastService.warn(msg)

                        _.pull(this.postQueue, post)
                    } else {
                        if (response.code === 'ERR_POST_RATE_LIMIT') {
                            let msg = 'Post Rate Limit hit, trying again in 60 seconds.'
                            console.error(msg, response)
                            this.toastService.warn(msg)
                        }
                        this.lastTimeout = setTimeout(() => this.startPosting(), 60000)
                    }
                })
        } else {
            this.posting = false
        }
    }

}
