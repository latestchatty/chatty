import {Injectable} from 'angular2/core'
import {Http} from 'angular2/http'

@Injectable()
export class ApiService {
    private base = 'https://winchatty.com/v2/'

    constructor(private http:Http) {
    }

    get(url) {
        return this.http.get(this.base + url)
            .map(res => res.json())
            .toPromise()
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
}
