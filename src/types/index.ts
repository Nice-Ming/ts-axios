export type Method =
  | 'get'
  | 'GET'
  | 'delete'
  | 'DELETE'
  | 'head'
  | 'HEAD'
  | 'options'
  | 'OPTIONS'
  | 'post'
  | 'POST'
  | 'put'
  | 'PUT'
  | 'patch'
  | 'PATCH'

export interface Axios {
  request<T = any> (config: AxiosRequestConfig): AxiosPromise<T>
  get<T = any> (url: string, config?: AxiosRequestConfig): AxiosPromise<T>
  delete<T = any> (url: string, config?: AxiosRequestConfig): AxiosPromise<T>
  head<T = any> (url: string, config?: AxiosRequestConfig): AxiosPromise<T>
  options<T = any> (url: string, config?: AxiosRequestConfig): AxiosPromise<T>
  post<T = any> (url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>
  put<T = any> (url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>
  patch<T = any> (url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>
}

export interface AxiosInstance extends Axios {
  <T = any>(config: AxiosRequestConfig): AxiosPromise<T>
  <T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
}

export interface AxiosRequestConfig {
  url?: string
  headers?: any
  method?: Method
  data?: any
  params?: any
  responseType?: XMLHttpRequestResponseType
  timeout?: number
}

export interface AxiosResponse<T = any> {
  status: number
  statusText: string
  headers: any
  data: T
  config: AxiosRequestConfig
  request: any
}

export interface AxiosPromise<T = any> extends Promise<AxiosResponse<T>> {}

export interface AxiosError extends Error {
  config: AxiosRequestConfig
  isAxiosError: boolean
  code?: string
  request?: any
  response?: AxiosResponse
}
