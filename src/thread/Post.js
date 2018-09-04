import React from 'react'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Tooltip from '@material-ui/core/Tooltip'
import CloseIcon from '@material-ui/icons/Close'
import StarIcon from '@material-ui/icons/Star'
import StarBorderIcon from '@material-ui/icons/StarBorder'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import ReplyIcon from '@material-ui/icons/Reply'
import {withStyles} from '@material-ui/core/styles'
import PostExpirationBar from './PostExpirationBar'
import PostDate from './PostDate'
import PostAuthor from './PostAuthor'
import classnames from 'classnames'
import ReplyBox from '../replyBox/ReplyBox'
import withAuth from '../context/auth/withAuth'

class Post extends React.PureComponent {
    handleReplyClick = () => this.props.onOpenReplyBox(this.props.post.id)

    render() {
        const {classes, isLoggedIn, post, onCollapse, onPinned, replyBoxOpenForId, onCloseReplyBox} = this.props
        const html = {__html: post.body}
        let tagClass
        if (post.category === 'nws') {
            tagClass = 'tagNws'
        } else if (post.category === 'informative') {
            tagClass = 'tagInformative'
        } else if (/shacknews/i.test(post.author)) {
            tagClass = 'tagFrontpage'
        }
        let replyBorder = post.parentId > 0 ? 'replyBorder' : null

        return (
            <React.Fragment>
                <Card className={classnames(classes.card, classes[tagClass], classes[replyBorder])}>
                    <div className={classes.header}>
                        <PostAuthor post={post}/>

                        <span className={classes.flex}/>

                        <PostDate date={post.date}/>

                        {post.parentId === 0 && <PostExpirationBar date={post.date}/>}
                    </div>

                    <CardContent className={classnames('postbody', classes.content)}>
                        <span dangerouslySetInnerHTML={html}/>
                    </CardContent>

                    <CardActions className={classes.actions} disableActionSpacing>
                        <Tooltip disableFocusListener title='Collapse' enterDelay={350}>
                            <CloseIcon className={classes.toolbarButton} onClick={onCollapse}/>
                        </Tooltip>

                        {
                            isLoggedIn &&
                            <Tooltip disableFocusListener title='Reply' enterDelay={350}>
                                <ReplyIcon className={classes.toolbarButton} onClick={this.handleReplyClick}/>
                            </Tooltip>
                        }

                        {
                            isLoggedIn && post.parentId === 0 &&
                            <React.Fragment>
                                {
                                    post.pinned &&
                                    <Tooltip disableFocusListener title='Unpin Thread' enterDelay={350}>
                                        <StarIcon className={classes.toolbarButton} onClick={onPinned}/>
                                    </Tooltip>
                                }
                                {
                                    !post.pinned &&
                                    <Tooltip disableFocusListener title='Pin Thread' enterDelay={350}>
                                        <StarBorderIcon className={classes.toolbarButton} onClick={onPinned}/>
                                    </Tooltip>
                                }
                            </React.Fragment>
                        }

                        <Tooltip disableFocusListener title='View Post @ Shacknews.com' enterDelay={350}>
                            <a
                                className={classes.toolbarButton}
                                target='_blank'
                                href={`http://www.shacknews.com/chatty?id=${post.id}#item_${post.id}`}
                            >
                                <ExitToAppIcon className={classes.toolbarButton}/>
                            </a>
                        </Tooltip>
                    </CardActions>
                </Card>

                {
                    replyBoxOpenForId === post.id &&
                    <ReplyBox parentId={post.id} onCloseReplyBox={onCloseReplyBox} className={classes.replyBox}/>}
            </React.Fragment>
        )
    }
}

const styles = {
    card: {
        backgroundColor: '#202224',
        borderRadius: 0,
        marginBottom: 3
    },
    replyBorder: {
        border: '1px solid #656565'
    },
    replyBox: {
        marginTop: -3
    },
    tagNws: {
        borderLeft: '3px solid red !important'
    },
    tagInformative: {
        borderLeft: '3px solid #00bff3 !important'
    },
    tagFrontpage: {
        borderLeft: '3px solid mediumpurple !important'
    },
    content: {
        maxWidth: 'calc(100vw - 32)',
        color: 'lightgray',
        fontSize: 13,
        padding: '8px 16px'
    },
    header: {
        backgroundColor: '#373a3c',
        padding: '3px 3px 3px 16px',
        display: 'flex',
        flexDirection: 'row'
    },
    actions: {
        height: 34
    },
    flex: {
        flex: 1
    },
    toolbarButton: {
        width: 18,
        height: 18,
        cursor: 'pointer',
        color: '#fff',
        marginRight: 6
    }
}

export default withAuth(
    withStyles(styles)(
        Post
    )
)
