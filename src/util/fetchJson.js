import querystring from 'querystring'

const base = 'https://winchatty.com/v2'

export default async (url, options = {}) => {
    if (options.body) {
        options = {
            ...options,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                ...options.headers
            },
            body: querystring.stringify(options.body)
        }
    }
    let res = await fetch(`${base}/${url}`, options)
    if (res.ok) {
        return await tryJson(res)
    } else {
        let body = await tryJson(res)
        let {status, statusText} = res
        let result = {status, statusText, body}
        console.error('Http Error:', result)
        return Promise.reject(result)
    }
}

const tryJson = async res => {
    let text = await res.text()
    try {
        return JSON.parse(text)
    } catch (ex) {
        return text
    }
}
