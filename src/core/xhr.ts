import { AxiosRequestConfig, AxiosResponse, AxiosPromise } from '../types'
import { parseHeaders } from '../helpers/headers'
import { createError } from '../helpers/error'

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
	return new Promise((resolve, reject) => {
		const { url, headers, method = 'get', data = null, responseType, timeout, cancelToken } = config
		const request = new XMLHttpRequest()

		function handleResponse(response: AxiosResponse) {
			if (response.status >= 200 && response.status < 300) {
				resolve(response)
			} else {
				reject(
					createError(
						`Request failed with status code ${response.status}`,
						config,
						null,
						request,
						response
					)
				)
			}
		}

		if (responseType) {
			request.responseType = responseType
		}

		if (timeout) {
			request.timeout = timeout
		}

		if (cancelToken) {
			cancelToken.promise.then(reason => {
				request.abort()
				reject(reason)
			})
		}

		// 运行时url是有值的 断言url不为空
		request.open(method.toUpperCase(), url!, true)

		request.onreadystatechange = function handleLoad() {
			if (request.readyState !== 4) {
				return
			}

			if (request.status === 0) {
				return
			}

			const responseHeaders = parseHeaders(request.getAllResponseHeaders())
			const responseData =
				responseType && responseType !== 'text' ? request.response : request.responseText

			const response: AxiosResponse = {
				status: request.status,
				statusText: request.statusText,
				headers: responseHeaders,
				data: responseData,
				config,
				request,
			}

			handleResponse(response)
		}

		// 处理请求超时错误
		request.ontimeout = function handleTimeout() {
			reject(
				createError(`Timeout of ${config.timeout} ms exceeded`, config, 'ECONNABORTED', request)
			)
		}

		// 处理网络异常错误
		request.onerror = function handleError() {
			reject(createError('Network Error', config, null, request))
		}

		Object.keys(headers).forEach(name => {
			if (data === null && name.toLowerCase() === 'content-type') {
				delete headers[name]
			} else {
				request.setRequestHeader(name, headers[name])
			}
		})

		request.send(data)
	})
}
