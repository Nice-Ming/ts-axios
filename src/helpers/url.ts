import { isPlainObject, isDate } from './util'

function encode(val: string): string {
	return encodeURIComponent(val)
		.replace(/%40/g, '@')
		.replace(/%3A/gi, ':')
		.replace(/%24/g, '$')
		.replace(/%2C/gi, ',')
		.replace(/%20/g, '+')
		.replace(/%5B/gi, '[')
		.replace(/%5D/gi, ']')
}

export function buildURL(url: string, params?: any): string {
	if (!params) {
		return url
	}

	const parts: string[] = []

	Object.keys(params).forEach(key => {
		const param = params[key]

		if (param === null || typeof param === 'undefined') {
			return
		}

		let values = []

		if (Array.isArray(param)) {
			values = param
			key += '[]'
		} else {
			values = [param]
		}

		values.forEach(val => {
			if (isDate(val)) {
				val = val.toISOString()
			} else if (isPlainObject(val)) {
				val = JSON.stringify(val)
			}

			parts.push(`${encode(key)}=${encode(val)}`)
		})
	})

	const serializedParams = parts.join('&')

	if (serializedParams) {
		const markIndex = url.indexOf('#')

		if (markIndex !== -1) {
			url = url.slice(0, markIndex)
		}

		url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams
	}

	return url
}

interface URLOrigin {
	protocol: string
	host: string
}

function resolveURL(url: string): URLOrigin {
	const urlParsingNode = document.createElement('a')
	urlParsingNode.setAttribute('href', url)
	const { protocol, host } = urlParsingNode

	return {
		protocol,
		host,
	}
}

export function isURLSameOrigin(requestURL: string): boolean {
	const currentOrigin = resolveURL(window.location.href)
	const parsedOrigin = resolveURL(requestURL)

	return (
		parsedOrigin.protocol === currentOrigin.protocol && parsedOrigin.host === currentOrigin.host
	)
}
