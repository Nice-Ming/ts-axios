import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types'
import xhr from './xhr'
import { buildURL } from '../helpers/url'
import { flattenHeaders } from '../helpers/headers'
import { transform } from '../core/transform'
import { isAbsoluteURL, combineURL } from '../helpers/url'

export function transformURL(config: AxiosRequestConfig): string {
	let { url } = config
	const { baseURL, params, paramsSerializer } = config

	if (baseURL && !isAbsoluteURL(url!)) {
		url = combineURL(baseURL, url)
	}

	// 运行时url是有值的 断言url不为空
	return buildURL(url!, params, paramsSerializer)
}

function transformResponseData(res: AxiosResponse): AxiosResponse {
	res.data = transform(res.data, res.headers, res.config.transformResponse)
	return res
}

function processConfig(config: AxiosRequestConfig): void {
	config.url = transformURL(config)
	config.data = transform(config.data, config.headers, config.transformRequest)
	config.headers = flattenHeaders(config.headers, config.method!)
}

function throwIfCancellationRequested(config: AxiosRequestConfig) {
	if (config.cancelToken) {
		config.cancelToken.throwIfRequested()
	}
}

export default function dispatchRequest(config: AxiosRequestConfig): AxiosPromise {
	throwIfCancellationRequested(config)
	processConfig(config)

	return xhr(config).then(
		res => {
			return transformResponseData(res)
		},
		e => {
			if (e && e.response) {
				e.response = transformResponseData(e.response)
			}
			return Promise.reject(e)
		}
	)
}
