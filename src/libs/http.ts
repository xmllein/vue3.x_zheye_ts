import axios from 'axios'
import store from '../store'

const icode = '7A3566BE07F25452'
// interceptors 发送请求的拦截器
axios.interceptors.request.use((config) => {
  store.commit('setLoading', true)
  // 清空错误信息
  store.commit('setError', { status: false, message: '' })
  // get 请求，添加到 url 中
  config.params = { ...config.params, icode }
  // 其他请求，添加到 body 中
  // 如果是上传文件，添加到 FormData 中
  if (config.data instanceof FormData) {
    config.data.append('icode', icode)
  } else {
    // 普通的 body 对象，添加到 data 中
    console.log('config.data', config.data)
    config.data = { ...config.data, icode }
  }
  return config
})

// interceptors 响应的拦截器
axios.interceptors.response.use(
  (resp) => {
    setTimeout(() => {
      store.commit('setLoading', false)
    }, 1000)
    return resp
  },
  (e) => {
    const { error } = e.response.data
    store.commit('setError', { status: true, message: error })
    store.commit('setLoading', false)
    return Promise.reject(error)
  }
)

export default axios
