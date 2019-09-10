import { AxiosRequestConfig } from '../types'
import { isPlainObject, deepMerge } from '../helpers/util'

// 存放合并策略
const strats = Object.create(null)

// 默认合并策略
function defaultStrat(val1: any, val2: any): any {
	return typeof val2 !== 'undefined' ? val2 : val1
}

// 只接受自定义配置合并策略
function fromVal2Strat(val1: any, val2: any): any {
	if (typeof val2 !== 'undefined') {
		return val2
	}
}

// 合并配置时默认配置里以下字段会被忽略
const stratKeysFromVal2 = ['url', 'params', 'data']

stratKeysFromVal2.forEach(key => {
	strats[key] = fromVal2Strat
})

// 复杂对象合并策略
function deepMergeStrat(val1: any, val2: any): any {
	if (isPlainObject(val2)) {
		return deepMerge(val1, val2)
	} else if (typeof val2 !== 'undefined') {
		return val2
	} else if (isPlainObject(val1)) {
		return deepMerge(val1)
	} else {
		return val1
	}
}

const stratKeysDeepMerge = ['headers', 'auth']

stratKeysDeepMerge.forEach(key => {
	strats[key] = deepMergeStrat
})

/**
 * 合并默认配置和自定义配置
 *
 * @param {AxiosRequestConfig} config1 默认配置
 * @param {AxiosRequestConfig} config2 自定义配置
 * @returns {AxiosRequestConfig} 合并后的配置
 */
export default function mergeConfig(
	config1: AxiosRequestConfig,
	config2 = {} as AxiosRequestConfig
): AxiosRequestConfig {
	const config = Object.create(null)

	function mergeField(key: string): void {
		const strat = strats[key] || defaultStrat
		config[key] = strat(config1[key], config2[key])
	}

	for (const key in config2) {
		mergeField(key)
	}

	for (const key in config1) {
		if (!config2[key]) {
			mergeField(key)
		}
	}

	return config
}
