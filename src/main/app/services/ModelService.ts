declare var _ : any
import {Injectable} from 'angular2/core'
import {EmployeeList}  from '../util/EmployeeList'
import {ModList} from '../util/ModList'
import {SettingsService} from './SettingsService'
import {BodyTransformService} from './BodyTransformService'

@Injectable()
export class ModelService {
    private threads = []
    private newThreads = []
    private posts = {}

    constructor(private bodyTransformService:BodyTransformService,
                private settingsService:SettingsService) {
    }

    updateAllThreads() {
        //fix thread expirations
        _.each(this.threads, thread => this.updateExpiration(thread))

        //fix user class
        _.forIn(this.posts, post => {
            this.updateUserClass(post, this.posts[post.threadId])
        })
    }

    addThread(post, event) {
        var thread = this.fixThread(post)
        if (event === true) {
            this.newThreads.push(thread)
        } else {
            this.threads.push(thread)
        }
        this.posts[thread.threadId] = thread
        return thread
    }

    getThreads() {
        return this.threads
    }

    getNewThreads() {
        return this.newThreads
    }

    addPost(post, thread) {
        if (!this.posts[post.id]) {
            thread = thread || this.posts[post.threadId]
            var parent = this.posts[post.parentId]
            if (parent && thread) {
                var fixedPost = this.fixPost(post, thread)
                this.updateLineClass(fixedPost, thread)
                this.updateModTagClass(fixedPost)
                fixedPost.parentAuthor = parent.author

                thread.replyCount++

                parent.posts.push(fixedPost)
                this.posts[fixedPost.id] = fixedPost

                return {thread: thread, parent: parent, post: fixedPost}
            }
        }
    }

    getPost(id) {
        return this.posts[id]
    }

    getPostThread(post) {
        if (post.parentId > 0) {
            return this.getPost(post.threadId)
        } else {
            return post
        }
    }

    changeCategory(id, category) {
        var post = this.posts[id]
        if (post) {
            if (category === 'nuked') {
                //remove if it's a root post
                _.pull(this.threads, post)

                //recursively remove all children
                this.removePost(post)

                //update reply count
                this.countReplies(post)
            } else {
                post.category = category
                this.updateModTagClass(post)
            }
        }
    }

    cleanCollapsed() {
        this.settingsService.cleanCollapsed(this.posts)
    }

    clear() {
        while (this.threads.length) {
            this.threads.pop()
        }
        this.posts = {}
    }

    private fixThread(thread) {
        var threadPosts = _.sortBy(thread.posts, 'id')

        //handle root post
        if (thread.posts) {
            var rootPost = _.find(threadPosts, {parentId: 0})
            _.pull(threadPosts, rootPost)
            thread.id = rootPost.id
            thread.threadId = rootPost.id
            thread.parentId = 0
            thread.author = rootPost.author
            thread.date = rootPost.date
            thread.category = rootPost.category
            thread.body = rootPost.body
            thread.lols = rootPost.lols
        }
        thread.visible = true
        thread.lastPostId = thread.id
        thread.replyCount = 0
        thread.recent = []
        thread.posts = []
        this.posts[thread.id] = thread
        this.fixPost(thread, null)
        this.updateModTagClass(thread)
        this.updateExpiration(thread)

        while (threadPosts.length > 0) {
            var post = threadPosts.shift()
            this.addPost(post, thread)
        }

        //check if it's supposed to be collapsed
        if (this.settingsService.isCollapsed(thread.threadId)) {
            thread.state = 'collapsed'
            thread.visible = false
        } else if (thread.replyCount > 10) {
            thread.state = 'truncated'
        }

        return thread
    }

    private fixPost(post, thread) {
        //parse body for extra features
        post.body = this.bodyTransformService.parse(post)

        //date object for date pipe
        post.date = new Date(post.date)

        //create sub-post container
        post.posts = post.posts || []

        //add user class highlight
        this.updateUserClass(post, thread)

        //add last action date
        if (thread) {
            thread.lastPostId = post.id
        }

        return post
    }

    private updateUserClass(post, thread) {
        if (post.author.toLowerCase() === this.settingsService.getUsername().toLowerCase()) {
            post.userClass = 'user_me'
        } else if (thread && post.id !== thread.id && post.author.toLowerCase() === thread.author.toLowerCase()) {
            post.userClass = 'user_op'
        } else if (_.contains(EmployeeList, post.author.toLowerCase())) {
            post.userClass = 'user_employee'
        } else if (_.contains(ModList, post.author.toLowerCase())) {
            post.userClass = 'user_mod'
        } else {
            post.userClass = null
        }
    }

    private updateLineClass(post, thread) {
        thread.recent.push(post)

        if (thread.recent.length > 10) {
            thread.recent.shift()
        }

        _.each(thread.recent, (recentPost, index) => {
            recentPost.lineClass = 'oneline' + (9 - index)
        })
    }

    private updateModTagClass(post) {
        if (post.category === 'informative') {
            post.tagClass = 'postInformative'
        } else if (post.category === 'nws') {
            post.tagClass = 'postNws'
        } else if (post.author.toLowerCase() === 'shacknews') {
            post.tagClass = 'postFrontpage'
        } else {
            delete post.tagClass
        }
    }

    private updateExpiration(thread) {
        thread.expirePercent = Math.min(((((new Date().getTime()) - thread.date.getTime()) / 3600000) / 18) * 100, 100)
        if (thread.expirePercent <= 25) {
            thread.expireColor = 'springgreen'
        } else if (thread.expirePercent <= 50) {
            thread.expireColor = 'yellow'
        } else if (thread.expirePercent <= 75) {
            thread.expireColor = 'orange'
        } else {
            thread.expireColor = 'red'
        }
    }

    private removePost(post) {
        delete this.posts[post.id]
        _.each(post.posts, this.removePost)
    }

    private countReplies(post) {
        return _.reduce(post.posts, (result, subreply) => {
            return result + this.countReplies(subreply) + 1
        }, 0)
    }
}
