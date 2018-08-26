import {Component, Input} from '@angular/core'
import {ActionService} from '../services/ActionService'
import {TagGroups} from '../util/TagGroups'
import {PostService} from '../services/PostService'
import {AutoFocus} from '../directives/AutoFocus'
import {DisableHotkeys} from '../directives/DisableHotkeys'

import './replybox.scss';
import './tagLegend.scss';

@Component({
    selector: 'replybox',
    template: require('./replybox.html'),
    directives: [AutoFocus, DisableHotkeys]
})
export class ReplyBox {
    @Input() public post
    @Input() public replyclass
    public replyBody = ''
    public tagGroups = TagGroups

    constructor(private actionService:ActionService,
                private postService:PostService) {
    }

    addTag(tag) {
        this.replyBody += tag.open + tag.close
    }

    submitPost() {
        if (this.replyBody) {
            this.postService.submitPost(this.post.id, this.replyBody)
            this.close()
        }
    }

    close() {
        this.actionService.closePostReplyBox(this.post)
    }
}
