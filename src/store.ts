import { createStore, Commit } from 'vuex'
import axios from './libs/http'
import { StorageType, StorageHandler } from './libs/storage'

import {
  testColumns,
  testPosts,
  currentUser,
  ColumnProps,
  PostProps,
  UserProps
} from './testData'

// 使用 localStorage
const storageType = StorageType.Local
const storageHandler = new StorageHandler()

// 全局错误接口
export interface GlobalErrorProps {
  status: boolean
  message?: string
}

// 1. 定义接口（state）
export interface GlobalDataProps {
  token: string
  error: GlobalErrorProps
  columns: ColumnProps[]
  posts: PostProps[]
  user: UserProps
  loading: boolean
}

/**
 * get获取数据
 * @param url 请求地址
 * @param mutationName mutation名称
 * @param commit commit方法
 */
const getAndCommit = async (url: string, mutationName: string, commit: any) => {
  const { data } = await axios.get(url)
  commit(mutationName, data)
}
/**
 * post获取数据
 * @param url 请求地址
 * @param mutationName mutation名称
 * @param commit commit方法
 * @param payload post传递参数
 * @returns 返回数据
 */
const postAndCommit = async (
  url: string,
  mutationName: string,
  commit: Commit,
  payload: any
) => {
  const { data } = await axios.post(url, payload)
  commit(mutationName, data)
  return data
}

// 2. 创建store
const store = createStore<GlobalDataProps>({
  // 初始化state
  state: {
    columns: testColumns,
    posts: testPosts,
    user: currentUser,
    error: { status: false },
    loading: false,
    token: storageHandler.getItem(storageType, 'token') || ''
  },
  //  定义mutations
  mutations: {
    // 创建文章
    createPost(state, newPost) {
      state.posts.push(newPost)
    },
    // 获取专栏列表
    fetchColumns(state, rawData) {
      state.columns = rawData.data.list
    },
    // 获取专栏详情
    fetchColumn(state, rawData) {
      state.columns = [rawData.data]
    },
    // 获取专栏下的文章
    fetchPosts(state, rawData) {
      state.posts = rawData.data.list
    },
    // 设置loading
    setLoading(state, status) {
      state.loading = status
    },
    // 登录设置token
    login(state, rawData) {
      const { token } = rawData.data
      state.token = token
      storageHandler.setItem(storageType, 'token', token)
      axios.defaults.headers.common.Authorization = `Bearer ${token}`
    },
    // 获取当前用户信息
    fetchCurrentUser(state, rawData) {
      state.user = { isLogin: true, ...rawData.data }
    },
    // 错误信息处理
    setError(state, e: GlobalErrorProps) {
      state.error = e
    },
    // 退出登录
    logout(state) {
      state.token = ''
      state.user = { isLogin: false }
      storageHandler.remove(storageType, 'token')
      delete axios.defaults.headers.common.Authorization
    }
  },
  // 定义getters
  getters: {
    // 获取专栏详情
    getColumnById: (state) => (id: string) => {
      return state.columns.find((c) => c._id === id)
    },
    // 获取当前专栏下的文章
    getPostsByCid: (state) => (cid: string) => {
      return state.posts.filter((post) => post.column === cid)
    },
    getCurrentPost: (state) => (id: string) => {
      return state.posts.find((c) => c._id === id)
    }
  },
  // 定义actions
  actions: {
    // 获取专栏列表
    fetchColumns({ commit }) {
      getAndCommit('/api/columns', 'fetchColumns', commit)
    },
    // 获取专栏详情
    fetchColumn({ commit }, cid) {
      getAndCommit(`/api/columns/${cid}`, 'fetchColumn', commit)
    },
    // 获取专栏下的文章
    fetchPosts({ commit }, cid) {
      getAndCommit(`/api/columns/${cid}/posts`, 'fetchPosts', commit)
    },
    // 登录
    login({ commit }, payload) {
      return postAndCommit('/api/user/login', 'login', commit, payload)
    },
    // 获取当前用户信息
    fetchCurrentUser({ commit }) {
      return getAndCommit('/api/user/current', 'fetchCurrentUser', commit)
    },
    // 登录并获取当前用户信息
    loginAndFetch({ dispatch }, loginData) {
      return dispatch('login', loginData).then(() => {
        return dispatch('fetchCurrentUser')
      })
    },
    // 注册
    register({ commit }, payload) {
      return postAndCommit('/api/users', 'register', commit, payload)
    }
  }
})

export default store
