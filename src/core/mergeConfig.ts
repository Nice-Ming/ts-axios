import { AxiosRequestConfig } from '../types'
import { isPlainObject } from '../helpers/util'

// 存放合并策略
const strats = Object.create(null)

// 默认合并策略
function defaultStrat (val1: any, val2: any): any {
  return typeof val2 !== 'undefined' ? val2 : val1
}

// 只接受自定义配置合并策略
function fromVal2Strat (val1: any, val2: any): any {
  if (typeof val2 !== 'undefined') {
    return val2
  }
}

const stratKeysFromVal2 = ['url', 'params', 'data']

stratKeysFromVal2.forEach(key => {
  strats[key] = fromVal2Strat
})

// 复杂对象合并策略
function deepMergeStrat (val1: any, val2: any): any {
  if (isPlainObject(val2)) {
    return deepMergeStrat(val1, val2)
  } else if (typeof val2 !== 'undefined') {
    return val2
  } else if (isPlainObject(val1)) {
    return deepMergeStrat(val1)
  } else if (typeof val1 !== 'undefined') {
    return val1
  }
}

const stratKeysDeepMerge = ['header']

stratKeysDeepMerge.forEach(key => {
  strats[key] = deepMergeStrat
})

export default function mergeConfig (
  config1: AxiosRequestConfig,
  config2 = {} as AxiosRequestConfig
): AxiosRequestConfig {

  const config = Object.create(null)

  for (const key in config2) {
    mergeField(key)
  }

  for (const key in config1) {
    if (!config2[key]) {
      mergeField(key)
    }
  }


  function mergeField (key: string): void {
    const strat = strats[key] || defaultStrat
    config[key] = strat(config1[key], config2[key])
  }

  return config
}