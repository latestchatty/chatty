declare var _:any
import {Injectable} from 'angular2/core'
import {Http} from 'angular2/http'

@Injectable()
export class ApiService {
    private base = 'https://winchatty.com/v2/'

    constructor(private http:Http) {
    }

    getChatty() {
        return this.get('getChatty?count=5')
    }

    getNewestEventId() {
        return this.get('getNewestEventId')
    }

    getThread(id) {
        return this.get(`getThread?id=${id}`)
    }

    waitForEvent(lastEventId) {
        return this.get(`waitForEvent?lastEventId=${lastEventId}`)
    }

    getMarkedPosts(username) {
        return this.get('clientData/getMarkedPosts?username=' + encodeURIComponent(username))
    }

    login(username, password) {
        return this.post('https://winchatty.com/v2/verifyCredentials', {
            username: username,
            password: password
        })
    }

    submitPost(username, password, parentId, body) {
        return this.post('postComment', {
            username: username,
            password: password,
            parentId: parentId,
            text: body
        })
    }

    markPost(username, postId, markType) {
        return this.post('clientData/markPost', {
            username: username,
            postId: postId,
            type: markType
        })
    }

    getTotalInboxCount(username, password) {
        return this.post('getMessageCount', {
            username: username,
            password: password
        })
    }

    getMessages(username, password) {
        return this.post('getMessages', {
            username: username,
            password: password,
            folder: 'inbox',
            page: 1
        })
    }

    private get(url) {
        return this.http.get(this.base + url)
            .map(res => res.json())
            .toPromise()
    }

    private post(url, params) {
        var data = _.reduce(params, (result, value, key) => {
            return result + (result.length > 0 ? '&' : '') + key + '=' + encodeURIComponent(value)
        }, '')

        return this.http.post(this.base + url, data, <any>{
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            })
            .map(res => res.json())
            .toPromise()
    }
}
