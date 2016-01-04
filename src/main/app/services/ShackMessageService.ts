declare var _: any
import {Injectable} from 'angular2/core'
import {ApiService} from '../services/ApiService'
import {SettingsService} from '../services/SettingsService'

@Injectable()
export class ShackMessageService {
    public totalMessageCount = '...'
    public unreadMessageCount = '...'

    constructor(private apiService:ApiService,
                private settingsService:SettingsService) {
    }

    clear() {
        this.totalMessageCount = '...'
        this.unreadMessageCount = '...'
    }

    getTotalMessageCount() {
        return this.totalMessageCount
    }

    getUnreadMessageCount() {
        return this.unreadMessageCount
    }

    getMessages() {
        var user = this.settingsService.getUsername()
        var pass = this.settingsService.getPassword()
        return this.apiService.getMessages(user, pass)
            .catch(err => {
                console.error('Error while getting shack messages: ', err)
                return []
            })
    }

    refresh() {
        if (this.settingsService.isLoggedIn()) {
            var user = this.settingsService.getUsername()
            var pass = this.settingsService.getPassword()
            this.apiService.getTotalInboxCount(user, pass)
                .then(response => {
                    this.totalMessageCount = _.get(response, 'total')
                    this.unreadMessageCount = _.get(response, 'unread')
                })
                .catch(err => {
                    console.error('Error during shackmessage count update: ', err)
                    this.totalMessageCount = 'err'
                    this.unreadMessageCount = 'err'
                })
        }
    }

    goToInbox() {
        window.open('https://www.shacknews.com/messages', '_blank')
    }
}
