import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types'
import xhr from './xhr'
import { buildURL } from '../helpers/url'
import { transformRequest, transformResponse } from '../helpers/data'
import { processHeaders, flattenHeaders } from '../helpers/headers'

function transformURL(config: AxiosRequestConfig): string {
	const { url, params } = config
	// 运行时url是有值的 断言url不为空
	return buildURL(url!, params)
}

function transformHeaders(config: AxiosRequestConfig): any {
	const { headers = {}, data } = config
	return processHeaders(headers, data)
}

function transformRequestData(config: AxiosRequestConfig): any {
	return transformRequest(config.data)
}

function transformResponseData(res: AxiosResponse): AxiosResponse {
	res.data = transformResponse(res.data)
	return res
}

function processConfig(config: AxiosRequestConfig): void {
	config.url = transformURL(config)
	config.headers = transformHeaders(config)
	config.data = transformRequestData(config)
	config.headers = flattenHeaders(config.headers, config.method)
}

export default function dispatchRequest(config: AxiosRequestConfig): AxiosPromise {
	processConfig(config)

	return xhr(config).then(res => {
		return transformResponseData(res)
	})
}
