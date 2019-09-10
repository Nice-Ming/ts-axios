import { AxiosRequestConfig, AxiosResponse, AxiosPromise } from '../types'
import { parseHeaders } from '../helpers/headers'
import { createError } from '../helpers/error'
import { isURLSameOrigin } from '../helpers/url'
import { isFormData } from '../helpers/util'
import cookie from '../helpers/cookie'

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
	return new Promise((resolve, reject) => {
		const request = new XMLHttpRequest()
		const {
			url,
			headers = {},
			method,
			data = null,
			responseType,
			timeout,
			cancelToken,
			withCredentials,
			xsrfCookieName,
			xsrfHeaderName,
			onDownloadProgress,
			onUploadProgress,
			auth,
			validateStatus,
		} = config

		function handleResponse(response: AxiosResponse) {
			// 校验状态码
			if (!validateStatus || validateStatus(response.status)) {
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

		function configureRequest(): void {
			if (responseType) {
				request.responseType = responseType
			}

			if (timeout) {
				request.timeout = timeout
			}

			if (withCredentials) {
				request.withCredentials = true
			}
		}

		function addEvents(): void {
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

				// 处理响应结果
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

			if (onDownloadProgress) {
				request.onprogress = onDownloadProgress
			}

			if (onUploadProgress) {
				request.upload.onprogress = onUploadProgress
			}
		}

		function processHeaders(): void {
			// 添加 HTTP 身份验证
			if (auth) {
				headers['Authorization'] = 'Basic ' + window.btoa(auth.username + ':' + auth.password)
			}

			// FormData数据格式 浏览器会自己设置Content-Type
			if (isFormData(data)) {
				delete headers['Content-Type']
			}

			// 携带cookie时 添加xsrf防御
			if ((withCredentials || isURLSameOrigin(url!)) && xsrfCookieName) {
				const xsrfValue = cookie.read(xsrfCookieName)

				if (xsrfValue && xsrfHeaderName) {
					headers[xsrfHeaderName] = xsrfValue
				}
			}

			// 当请求数据为空 移除Content-Type
			Object.keys(headers).forEach(name => {
				if (data === null && name.toLowerCase() === 'content-type') {
					delete headers[name]
				} else {
					request.setRequestHeader(name, headers[name])
				}
			})
		}

		function processCancel(): void {
			if (cancelToken) {
				cancelToken.promise.then(reason => {
					request.abort()
					reject(reason)
				})
			}
		}

		// 运行时url是有值的 断言url不为空
		request.open(method!.toUpperCase(), url!, true)

		// 配置 request 对象
		configureRequest()

		// 添加事件处理函数
		addEvents()

		// 处理请求 headers
		processHeaders()

		// 处理请求取消逻辑
		processCancel()

		request.send(data)
	})
}
