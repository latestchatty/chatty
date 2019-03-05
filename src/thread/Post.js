import React, {useContext, useEffect, useMemo, useRef} from 'react'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Tooltip from '@material-ui/core/Tooltip'
import CloseIcon from '@material-ui/icons/Close'
import StarIcon from '@material-ui/icons/Star'
import StarBorderIcon from '@material-ui/icons/StarBorder'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import ReplyIcon from '@material-ui/icons/Reply'
import PostExpirationBar from './PostExpirationBar'
import PostDate from './PostDate'
import PostAuthor from './PostAuthor'
import classnames from 'classnames'
import ReplyBox from '../replyBox/ReplyBox'
import Tags from './Tags'
import TagButton from './TagButton'
import AuthContext from '../context/auth/AuthContext'
import FilterContext from '../context/filter/FilterContext'
import {makeStyles} from '@material-ui/styles'
import PostBody from './PostBody'

function Post({post, thread, onCollapse, onPinned, replyBoxOpenForId, onOpenReplyBox, onCloseReplyBox}) {
    const classes = useStyles()
    const domElement = useRef(null)
    const {isLoggedIn} = useContext(AuthContext)
    const {filterSettings, isPostVisible} = useContext(FilterContext)

    const tagClass = useMemo(() => {
        if (post.category === 'nuked') {
            return null
        } else if (post.category === 'nws') {
            return 'tagNws'
        } else if (post.category === 'informative') {
            return 'tagInformative'
        } else if (/shacknews/i.test(post.author)) {
            return 'tagFrontpage'
        }
        return null
    }, [post.category])

    const isReply = post.parentId > 0
    const replyBorder = isReply ? 'replyBorder' : null

    const handleReplyClick = () => onOpenReplyBox(post.id)

    // Scroll into view when first visible
    useEffect(() => {
        if (isReply) {
            const rect = domElement.current.getBoundingClientRect()
            const viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight)
            const above = rect.bottom < 0
            const below = rect.top - viewHeight >= 0
            if (above) {
                window.scrollTo({
                    left: 0,
                    top: domElement.current.offsetTop - 75,
                    behavior: 'smooth'
                })
            } else if (below) {
                window.scrollTo({
                    left: 0,
                    top: domElement.current.offsetTop - viewHeight + rect.height + 24,
                    behavior: 'smooth'
                })
            }
        }
    }, [])

    const visible = useMemo(() => isPostVisible(thread, post), [filterSettings])
    if (!visible) return null
    return (
        <React.Fragment>
            <div ref={domElement}>
                <Card className={classnames(classes.card, classes[tagClass], classes[replyBorder])}>
                    <div className={classes.header}>
                        <PostAuthor post={post} thread={thread}/>

                        <Tags tags={post.lols} variant='post'/>

                        <span className={classes.flex}/>

                        <PostDate date={post.date}/>

                        {post.parentId === 0 && <PostExpirationBar date={post.date}/>}
                    </div>

                    <CardContent className={classnames('postbody', classes.content)}>
                        <PostBody post={post}/>
                    </CardContent>

                    <CardActions className={classes.actions} disableActionSpacing>
                        <Tooltip
                            disableFocusListener
                            title={post.markType === 'collapsed' ? 'Uncollapse' : 'Collapse'}
                            enterDelay={350}
                        >
                            <CloseIcon
                                className={
                                    classnames(classes.toolbarButton, post.markType === 'collapsed' ? classes.collapsed : null)
                                }
                                onClick={onCollapse}
                            />
                        </Tooltip>

                        {
                            isLoggedIn &&
                            <Tooltip disableFocusListener title='Reply' enterDelay={350}>
                                <ReplyIcon className={classes.toolbarButton} onClick={handleReplyClick}/>
                            </Tooltip>
                        }

                        {
                            isLoggedIn && post.parentId === 0 &&
                            <React.Fragment>
                                {
                                    post.markType === 'pinned' &&
                                    <Tooltip disableFocusListener title='Unpin Thread' enterDelay={350}>
                                        <StarIcon
                                            className={classnames(classes.toolbarButton, classes.pinned)}
                                            onClick={onPinned}
                                        />
                                    </Tooltip>
                                }
                                {
                                    post.markType !== 'pinned' &&
                                    <Tooltip disableFocusListener title='Pin Thread' enterDelay={350}>
                                        <StarBorderIcon className={classes.toolbarButton} onClick={onPinned}/>
                                    </Tooltip>
                                }
                            </React.Fragment>
                        }

                        <TagButton postId={post.id} className={classes.toolbarButton}/>

                        <Tooltip disableFocusListener title='View Post @ Shacknews.com' enterDelay={350}>
                            <a
                                className={classes.toolbarButton}
                                target='_blank'
                                rel="noopener noreferrer"
                                href={`http://www.shacknews.com/chatty?id=${post.id}#item_${post.id}`}
                            >
                                <ExitToAppIcon className={classes.toolbarButton}/>
                            </a>
                        </Tooltip>
                    </CardActions>
                </Card>
            </div>
            {
                replyBoxOpenForId === post.id &&
                <ReplyBox parentId={post.id} onCloseReplyBox={onCloseReplyBox} className={classes.replyBox}/>
            }
        </React.Fragment>
    )
}

const useStyles = makeStyles({
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
    },
    collapsed: {
        color: '#f00 !important'
    },
    pinned: {
        color: '#fcbf20 !important'
    }
})

export default Post
