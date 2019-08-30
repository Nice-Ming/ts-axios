import {
	AxiosRequestConfig,
	AxiosPromise,
	AxiosResponse,
	Method,
	ResolvedFn,
	RejectedFn,
} from '../types'
import dispatchRequest from './dispatchRequest'
import InterceptorManager from './InterceptorManager'
import mergeConfig from '../core/mergeConfig'

interface Interceptors {
	request: InterceptorManager<AxiosRequestConfig>
	response: InterceptorManager<AxiosResponse>
}

interface PromiseChain<T> {
	resolved: ResolvedFn<T> | ((config: AxiosRequestConfig) => AxiosPromise)
	rejected?: RejectedFn
}

export default class Axios {
	defaults: AxiosRequestConfig
	interceptors: Interceptors

	constructor(initConfig: AxiosRequestConfig) {
		this.defaults = initConfig
		this.interceptors = {
			request: new InterceptorManager<AxiosRequestConfig>(),
			response: new InterceptorManager<AxiosResponse>(),
		}
	}

	request(url: string | AxiosRequestConfig, config?: any): AxiosPromise {
		if (typeof url === 'string') {
			if (!config) {
				config = {}
			}
			config.url = url
		} else {
			config = url
		}

		config = mergeConfig(this.defaults, config)

		const chain: PromiseChain<any>[] = [
			{
				resolved: dispatchRequest,
				rejected: undefined,
			},
		]

		this.interceptors.request.forEach(interceptor => {
			// 请求拦截器，倒序执行
			chain.unshift(interceptor)
		})

		this.interceptors.response.forEach(intercpetor => {
			// 响应拦截器，顺序执行
			chain.push(intercpetor)
		})

		let promise = Promise.resolve(config)

		while (chain.length) {
			const { resolved, rejected } = chain.shift()!
			promise = promise.then(resolved, rejected)
		}

		return promise
	}

	get(url: string, config?: AxiosRequestConfig): AxiosPromise {
		return this._requestMethodWithoutData('get', url, config)
	}

	delete(url: string, config?: AxiosRequestConfig): AxiosPromise {
		return this._requestMethodWithoutData('delete', url, config)
	}

	head(url: string, config?: AxiosRequestConfig): AxiosPromise {
		return this._requestMethodWithoutData('head', url, config)
	}

	options(url: string, config?: AxiosRequestConfig): AxiosPromise {
		return this._requestMethodWithoutData('options', url, config)
	}

	post(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
		return this._requestMethodWithData('post', url, data, config)
	}

	put(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
		return this._requestMethodWithData('put', url, data, config)
	}

	patch(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
		return this._requestMethodWithData('patch', url, data, config)
	}

	_requestMethodWithoutData(
		method: Method,
		url: string,
		config?: AxiosRequestConfig
	): AxiosPromise {
		return this.request(Object.assign(config || {}, { url, method }))
	}

	_requestMethodWithData(
		method: Method,
		url: string,
		data?: any,
		config?: AxiosRequestConfig
	): AxiosPromise {
		return this.request(
			Object.assign(config || {}, {
				url,
				method,
				data,
			})
		)
	}
}
