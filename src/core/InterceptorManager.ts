import { ResolvedFn, RejectedFn } from '../types'

interface Interceptor<T> {
  resolved: ResolvedFn<T>
  rejected?: RejectedFn
}

export default class InterceptorManager<T> {
  private interceptors: Array<Interceptor<T> | null>

  constructor () {
    this.interceptors = []
  }

  use (resolved: ResolvedFn<T>, rejected?: RejectedFn) {
    this.interceptors.push({
      resolved,
      rejected
    })

    return this.interceptors.length - 1
  }

  forEach (fn: (interceptor: Interceptor<T>) => void): void {
    this.interceptors.forEach(interceptor => {
      interceptor && fn(interceptor)
    })
  }

  eject (id: number): void {
    if (this.interceptors[id]) {
      this.interceptors[id] = null
    }
  }
}