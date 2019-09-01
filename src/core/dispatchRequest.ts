import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types'
import xhr from './xhr'
import { buildURL } from '../helpers/url'
import { flattenHeaders } from '../helpers/headers'
import { transform } from '../core/transform'

function transformURL(config: AxiosRequestConfig): string {
	const { url, params } = config
	// 运行时url是有值的 断言url不为空
	return buildURL(url!, params)
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

export default function dispatchRequest(config: AxiosRequestConfig): AxiosPromise {
	processConfig(config)

	return xhr(config).then(res => {
		return transformResponseData(res)
	})
}
