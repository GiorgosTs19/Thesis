export const appendUrlParams = (url, params) => {
    const queryString = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
        .join('&');

    return url + (url.includes('?') ? '&' : '?') + queryString;
}
