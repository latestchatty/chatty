import React, {useMemo} from 'react'

function PostBody({post}) {
    const html = useMemo(() => {
        let fixed = post.body

        if (post.author === 'Shacknews') {
            fixed = post.body.replace('href="/', 'href="https://www.shacknews.com/')
        }
        fixed = post.body.replace('<a href=', '<a target="_blank" rel="noopener noreferrer" href=')

        // TODO: search for embeddable urls here

        return {__html: fixed}
    }, [post.body, post.author])

    return (
        <span dangerouslySetInnerHTML={html}/>
    )
}

export default PostBody
