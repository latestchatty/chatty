export const cleanAllStyles = body => body.replace(/(<[^>]+>)/gm, '')
export const cleanMostStyles = body => body.replace(/(<(?!span)(?!\/span)[^>]+>| tabindex="1")/gm, ' ')

export const getSnippet = body => {
    const input = cleanMostStyles(body)
    const maxLength = 106

    let i = 0
    let len = 0
    let tag = false
    let char = false
    while (i < input.length && len < maxLength) {
        if (input[i] === '<') {
            tag = true
        } else if (input[i] === '>') {
            tag = false
        } else if (input[i] === '&') {
            char = true
        } else if (input[i] === '' && char) {
            char = false
            len++
        } else if (!tag) {
            len++
        }

        i++
    }

    let output = input.slice(0, i).trim()
    if (i < input.length || !output) {
        output += '...'
    }

    return output
}
