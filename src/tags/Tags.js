import React, {useMemo} from 'react'
import Chip from '@material-ui/core/Chip'
import {supportedTags, colorByTag} from './tagData'
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
            {fixedTags.map(({tag, count}) => {
                if (count < 1) return null
                else if (variant === 'post') {
                    return (
                        <Chip
                            key={tag}
                            className={classes.chip}
                            style={{
                                color: colorByTag[tag],
                                border: `1px solid ${colorByTag[tag]}`
                            }}
                            label={`${count} ${tag}`}
                            variant='outlined'
                        />
                    )
                } else if (variant === 'oneline') {
                    return (
                        <span key={tag} className={classes.nonChip} style={{color: colorByTag[tag]}}>
                            {`${count} ${tag}`}
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
    }
})

export default Tags
