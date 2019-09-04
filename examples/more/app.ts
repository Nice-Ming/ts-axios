import axios from '../../src'
import qs from 'qs'

document.cookie = 'a=b'

axios.get('/more/get').then(res => {
  console.log(res)
})

axios.post('http://127.0.0.1:9090/more/server2', {}, {
  withCredentials: true
}).then(res => {
  console.log(res)
})

// xsrf demo
const instance = axios.create({
  xsrfCookieName: 'XSRF-TOKEN-D',
  xsrfHeaderName: 'X-XSRF-TOKEN-D'
})

instance.get('/more/get').then(res => {
  console.log('csrf demo:', res)
})

// http auth demo
axios.post('/more/post', {
  a: 1
}, {
  auth: {
    username: 'chen',
    password: '123456'
  }
}).then(res => {
  console.log('http auth success demo', res)
})

axios.post('/more/post', {
  a: 1
}, {
  auth: {
    username: 'chen111',
    password: '123456'
  }
}).then(res => {
  console.log('http auth fail demo', res)
}).catch(err => {
  console.log('http auth fail demo', err)
})

// 自定义合法状态码 demo
axios.get('/more/304').then(res => {
  console.log(res)
}).catch(err => {
  console.log('默认状态码', err.message)
})


axios.get('/more/304', {
  validateStatus(status) {
    return status >= 200 && status < 400
  }
}).then(res => {
  console.log('自定义状态码', res)
}).catch(err => {
  console.log('自定义状态码', err.message)
})

// 自定义 params 的解析规则 demo
axios.get('/more/get', {
  params: new URLSearchParams('a=b&c=d')
}).then(res => {
  console.log(res)
})

axios.get('/more/get', {
  params: {
    a: 1,
    b: 2,
    c: ['a', 'b', 'c']
  }
}).then(res => {
  console.log(res)
})

const instance2 = axios.create({
  paramsSerializer(params) {
    return qs.stringify(params, { arrayFormat: 'brackets' })
  }
})

instance2.get('/more/get', {
  params: {
    a: 1,
    b: 2,
    c: ['a', 'b', 'c']
  }
}).then(res => {
  console.log(res)
})

// custom baseURL demo
const instance3 = axios.create({
  baseURL: 'https://img.mukewang.com/'
})

instance3.get('5cc01a7b0001a33718720632.gif')
instance3.get('https://img.mukewang.com/szimg/5becd5ad0001b89306000338-360-202.jpg')
instance3.get('//img.mukewang.com/szimg/5becd5ad0001b89306000338-360-202.jpg')


// axios.all axios.spread axios.getUri demo
function getA() {
  return axios.get('/more/A')
}
function getB() {
  return axios.get('/more/B')
}
function getC() {
  return axios.get('/more/C')
}

axios.all([getA(), getB(), getC()])
  .then(axios.spread(function(resA, resB, resC) {
    console.log('spread', resA.data)
    console.log('spread', resB.data)
    console.log('spread', resC.data)
  }))

axios.all([getA(), getB()])
  .then(([resA, resB]) => {
    console.log(resA.data)
    console.log(resB.data)
  })

const fakeConfig = {
  baseURL: 'https://www.baidu.com',
  url: '/user/12345',
  params: {
    idClient: 1,
    idTest: 2,
    testString: 'thisIsATest'
  }
}

console.log('axios.getUri result: ', axios.getUri(fakeConfig))