import Axios from './core/Axios'
import { AxiosRequestConfig, AxiosStatic } from './types'
import { extend } from './helpers/util'
import defaults from './defaults'
import mergeConfig from './core/mergeConfig'
import CancelToken from './cancel/CancelToken'
import Cancel, { isCancel } from './cancel/Cancel'

function createAxiosInstance(config: AxiosRequestConfig): AxiosStatic {
	const context = new Axios(config)
	const instance = Axios.prototype.request.bind(context)

	extend(instance, context)

	return instance as AxiosStatic
}

const axios = createAxiosInstance(defaults)

axios.create = function create(config) {
	return createAxiosInstance(mergeConfig(defaults, config))
}

axios.CancelToken = CancelToken
axios.Cancel = Cancel
axios.isCancel = isCancel

export default axios
