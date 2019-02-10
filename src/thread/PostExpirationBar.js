import React from 'react'
import {withStyles} from '@material-ui/core/styles'

function PostExpirationBar({classes, date}) {
    const now = (new Date().getTime())
    const then = new Date(date).getTime()
    const percent = Math.min((((now - then) / 3600000) / 18) * 100, 100)

    let backgroundColor = 'red'
    if (percent <= 25) {
        backgroundColor = 'springgreen'
    } else if (percent <= 50) {
        backgroundColor = 'yellow'
    } else if (percent <= 75) {
        backgroundColor = 'orange'
    }

    return (
        <div className={classes.wrapper}>
            <div
                className={classes.value}
                style={{width: `${percent}%`, backgroundColor}}
            />
        </div>
    )
}

const styles = {
    wrapper: {
        height: 8,
        width: 48,
        margin: 7,
        background:
            `rgb(221, 221, 221) -webkit-gradient(
                linear,
                0% 0%,
                0% 100%,
                from(rgb(170, 170, 170)),
                color-stop(0.4, rgb(204, 204, 204)),
                color-stop(0.6, rgb(204, 204, 204)),
                to(rgb(238, 238, 238))
            )`
    },
    value: {
        height: 8,
        backgroundImage:
            `-webkit-gradient(
                linear,
                0 100%,
                100% 0,
                color-stop(0.25, rgba(255, 255, 255, 0.4)),
                color-stop(0.25, transparent),
                color-stop(0.5, transparent),
                color-stop(0.5, rgba(255, 255, 255, 0.4)),
                color-stop(0.75, rgba(255, 255, 255, 0.4)),
                color-stop(0.75, transparent),
                to(transparent)
            )`,
        backgroundSize: '25px 25px',
        boxShadow: 'rgba(255, 255, 255, 0.298039) 0 2px 4px inset, rgba(0, 0, 0, 0.4) 0 -2px 3px inset'
    }
}

export default withStyles(styles)(PostExpirationBar)
