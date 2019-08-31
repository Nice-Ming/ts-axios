import axios, { AxiosTransformer } from '../../src'
import qs from 'qs'

import mergeConfig from '../../src/core/mergeConfig'

const config1 = {
  method: 'get',

  timeout: 0,

  headers: {
    common: {
      Accept: 'application/json, text/plain, */*'
    }
  }
}

const config2 = {
  url: '/config/post',
  method: 'post',
  data: {
    a: 1
  },
  headers: {
    test: '321'
  }
}

mergeConfig(config1, config2)

axios.defaults.headers.common['test2'] = 123

axios({
  url: '/config/post',
  method: 'post',
  data: qs.stringify({ a: 1 }),
  headers: {
    test: '321'
  }
}).then(res => {
  console.log(res.data)
})

// 请求和响应配置化 demo
// axios({
//   transformRequest: [
//     (function (data) {
//       return qs.stringify(data)
//     }),
//     ...(axios.defaults.transformRequest as AxiosTransformer[])
//   ],
//   transformResponse: [
//     ...(axios.defaults.transformResponse as AxiosTransformer[]),
//     function (data) {
//       if (typeof data === 'object') {
//         data.b = 'transform respone mark'
//       }
//       return data
//     }
//   ],
//   url: '/config/post',
//   method: 'post',
//   data: {
//     a: 1
//   }
// }).then(res => {
//   console.log(res.data)
// })

// // axios.create demo
// const instance = axios.create({
//   transformRequest: [
//     (function (data) {
//       return qs.stringify(data)
//     }),
//     ...(axios.defaults.transformRequest as AxiosTransformer[])
//   ],
//   transformResponse: [
//     ...(axios.defaults.transformResponse as AxiosTransformer[]),
//     function (data) {
//       if (typeof data === 'object') {
//         data.b = 'new instance transform respone mark'
//       }
//       return data
//     }
//   ]
// })

// instance({
//   url: '/config/post',
//   method: 'post',
//   data: {
//     a: 1
//   }
// }).then(res => console.log(res.data))