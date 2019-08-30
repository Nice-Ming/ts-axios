import { isPlainObject, deepMerge } from './util'
import { Method } from '../types'

function normalizeHeaderName(headers: any, normalizeName: string): void {
	if (!headers) {
		return
	}

	Object.keys(headers).forEach(name => {
		if (name !== normalizeName && name.toLowerCase() === normalizeName.toLocaleLowerCase()) {
			headers[normalizeName] = headers[name]
			delete headers[name]
		}
	})
}

export function processHeaders(headers: any, data: any): any {
	normalizeHeaderName(headers, 'Content-Type')

	if (isPlainObject(data)) {
		if (headers && !headers['Content-Type']) {
			headers['Content-Type'] = 'application/json;charset=utf-8'
		}
	}

	return headers
}

export function parseHeaders(headers: string): any {
	const parsed = Object.create(null)

	if (!headers) {
		return parsed
	}

	headers.split('\r\n').forEach(line => {
		// eslint-disable-next-line
		let [key, val] = line.split(':')

		if (!key) {
			return
		}

		if (val) {
			val = val.trim()
		}

		parsed[key] = val
	})

	return parsed
}

export function flattenHeaders(headers: any, method: Method) {
	if (!headers) {
		return headers
	}

	headers = deepMerge(headers.common || {}, headers[method] || {}, headers)

	const methodsToDelete = ['delete', 'get', 'head', 'options', 'post', 'put', 'patch', 'common']

	methodsToDelete.forEach(method => {
		delete headers[method]
	})

	return headers
}
