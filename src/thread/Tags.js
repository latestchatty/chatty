import React, {useMemo} from 'react'
import Chip from '@material-ui/core/Chip'
import classnames from 'classnames'
import supportedTags from './supportedTags'
import {makeStyles} from '@material-ui/styles'

function Tags({tags = [], variant}) {
    const classes = useStyles()
    const fixedTags = useMemo(() => {
        const validTags = tags.filter(tag => supportedTags.includes(tag.tag))
        const miscTagCount = tags.filter(tag => !supportedTags.includes(tag.tag))
            .reduce((acc, tag) => acc + tag.count, 0)
        return [
            ...validTags,
            {tag: 'tag', count: miscTagCount}
        ]
    }, [tags])

    return (
        <div className={variant === 'post' ? classes.containerPost : classes.containerOneline}>
            {fixedTags.map(tag => {
                if (tag.count < 1) return null
                else if (variant === 'post') {
                    return (
                        <Chip
                            key={tag.tag}
                            className={classnames(classes.chip, classes[tag.tag], classes[`${tag.tag}Border`])}
                            label={`${tag.count} ${tag.tag}`}
                            variant='outlined'
                        />
                    )
                } else if (variant === 'oneline') {
                    return (
                        <span key={tag.tag} className={classnames(classes.nonChip, classes[tag.tag])}>
                            {`${tag.count} ${tag.tag}`}
                        </span>
                    )
                }
                return null
            })}
        </div>
    )
}

const useStyles = makeStyles({
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
})

export default Tags
