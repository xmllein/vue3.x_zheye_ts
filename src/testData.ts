export interface ImageProps {
  _id?: string
  url?: string
  fitUrl?: string
  createdAt?: string
}
// 分栏接口
export interface ColumnProps {
  _id: string
  title: string
  avatar?: ImageProps
  description: string
}

// 文章接口
export interface PostProps {
  _id: string
  title: string
  content: string
  excerpt?: string
  image?: ImageProps | string
  createdAt: string
  column: string
  author?: string
  isHTML?: boolean
}

// 用户接口
export interface UserProps {
  isLogin: boolean
  nickName?: string
  _id?: string
  column?: string
  email?: string
  description?: string
  avatar?: ImageProps
}
// 验证规则接口
export interface RuleProps {
  type: 'required' | 'email' | 'custom'
  message: string
  validator?: () => boolean
}

// 全局返回数据接口
export interface ResponseType<P = Record<string, never>> {
  code: number
  msg: string
  data: P
}

// 消息类型
export type MessageType = 'success' | 'error' | 'default'

// 分栏测试数据
export const testColumns: ColumnProps[] = [
  {
    _id: '1',
    title: 'test1的专栏',
    description: '这是的test1专栏，有一段非常有意思的简介，可以更新一下欧',
    avatar: {
      url: 'http://vue-maker.oss-cn-hangzhou.aliyuncs.com/vue-marker/5ee22dd58b3c4520912b9470.jpg?x-oss-process=image/resize,m_pad,h_100,w_100'
    }
  },
  {
    _id: '2',
    title: 'test2的专栏',
    description: '这是的test2专栏，有一段非常有意思的简介，可以更新一下欧'
    // avatar: 'http://vue-maker.oss-cn-hangzhou.aliyuncs.com/vue-marker/5ee22dd58b3c4520912b9470.jpg?x-oss-process=image/resize,m_pad,h_100,w_100'
  },
  {
    _id: '3',
    title: 'test3的专栏',
    description: '这是的test3专栏，有一段非常有意思的简介，可以更新一下欧',
    avatar: {
      url: 'http://vue-maker.oss-cn-hangzhou.aliyuncs.com/vue-marker/5ee22dd58b3c4520912b9470.jpg?x-oss-process=image/resize,m_pad,h_100,w_100'
    }
  },
  {
    _id: '4',
    title: 'test4的专栏',
    description: '这是的test4专栏，有一段非常有意思的简介，可以更新一下欧',
    avatar: {
      url: 'http://vue-maker.oss-cn-hangzhou.aliyuncs.com/vue-marker/5ee22dd58b3c4520912b9470.jpg?x-oss-process=image/resize,m_pad,h_100,w_100'
    }
  }
]
// 文章测试数据
export const testPosts: PostProps[] = [
  {
    _id: '1',
    title: '这是我的第一篇文章',
    content: '这是的test1专栏，有一段非常有意思的简介，可以更新一下欧',
    image: {
      url: 'http://vue-maker.oss-cn-hangzhou.aliyuncs.com/vue-marker/5ee22dd58b3c4520912b9470.jpg?x-oss-process=image/resize,m_pad,h_100,w_100'
    },
    createdAt: '2020-06-11 10:34:22',
    column: '1'
  },
  {
    _id: '2',
    title: '这是我的第一篇文章',
    content: '这是的test1专栏，有一段非常有意思的简介，可以更新一下欧',
    image: {
      url: 'http://vue-maker.oss-cn-hangzhou.aliyuncs.com/vue-marker/5ee22dd58b3c4520912b9470.jpg?x-oss-process=image/resize,m_pad,h_100,w_100'
    },
    createdAt: '2020-06-11 10:34:22',
    column: '1'
  },
  {
    _id: '3',
    title: '这是我的第一篇文章',
    content: '这是的test1专栏，有一段非常有意思的简介，可以更新一下欧',
    createdAt: '2020-06-11 10:34:22',
    column: '2'
  }
]

// 用户测试数据
export const currentUser: UserProps = {
  isLogin: false,
  nickName: 'viking',
  _id: 'v_123',
  column: '1'
}
