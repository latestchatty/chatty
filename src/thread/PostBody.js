import React, {useMemo} from 'react'

function PostBody({post}) {
    const html = useMemo(() => {
        let fixed = post.body

        if (post.author === 'Shacknews') {
            fixed = post.body.replace('href="/', 'href="https://www.shacknews.com/')
        }

        // TODO: search for embeddable urls here

        return {__html: fixed}
    }, [post.body])

    return (
        <span dangerouslySetInnerHTML={html}/>
    )
}

export default PostBody
