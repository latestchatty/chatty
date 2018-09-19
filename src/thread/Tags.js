import React from 'react'
import Chip from '@material-ui/core/Chip'
import {withStyles} from '@material-ui/core/styles'
import classnames from 'classnames'

class Tags extends React.PureComponent {
    state = {
        tags: []
    }

    componentDidMount() {
        this.loadTags()
    }

    componentDidUpdate(prevProps) {
        if (prevProps.tags !== this.props.tags) this.loadTags()
    }

    loadTags() {
        const {tags = []} = this.props
        const validTags = tags.filter(tag => supportedTags.includes(tag.tag))
        const miscTagCount = tags.filter(tag => !supportedTags.includes(tag.tag))
            .reduce((acc, tag) => acc + tag.count, 0)
        this.setState({
            tags: [
                ...validTags,
                {tag: 'tag', count: miscTagCount}
            ]
        })
    }

    renderTag(tag) {
        const {classes, variant} = this.props
        if (tag.count < 1) return null

        if (variant === 'post') {
            return <Chip
                key={tag.tag}
                className={classnames(classes.chip, classes[tag.tag], classes[`${tag.tag}Border`])}
                label={`${tag.count} ${tag.tag}`}
                variant='outlined'
            />
        } else if (variant === 'oneline') {
            return <span
                key={tag.tag}
                className={classnames(classes.nonChip, classes[tag.tag])}
            >{`${tag.count} ${tag.tag}`}</span>
        }
    }

    render() {
        const {classes, variant} = this.props
        const {tags} = this.state
        return (
            <div className={variant === 'post' ? classes.containerPost : classes.containerOneline}>
                {tags.map(tag => this.renderTag(tag))}
            </div>
        )
    }
}

const supportedTags = ['lol', 'inf', 'unf', 'wtf']

const styles = {
    containerPost: {
        marginLeft: 12
    },
    containerOneline: {
        marginLeft: 4,
        whiteSpace: 'nowrap'
    },
    chip: {
        height: 16,
        marginTop: 2,
        marginRight: 6,
        fontSize: 10
    },
    nonChip: {
        marginRight: 4,
        fontSize: 9
    },
    lolBorder: {
        border: '1px solid #f80'
    },
    infBorder: {
        border: '1px solid #09c'
    },
    unfBorder: {
        border: '1px solid #f00'
    },
    wtfBorder: {
        border: '1px solid #c000c0'
    },
    tagBorder: {
        border: '1px solid #bbaf57'
    },
    lol: {
        color: '#f80'
    },
    inf: {
        color: '#09c'
    },
    unf: {
        color: '#f00'
    },
    wtf: {
        color: '#c000c0'
    },
    tag: {
        color: '#bbaf57'
    }
}

export default withStyles(styles)(Tags)
