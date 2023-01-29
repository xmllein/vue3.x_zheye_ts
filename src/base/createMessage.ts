import { createApp } from 'vue'
import Message from './Message.vue'
import { MessageType } from '@/testData'

// 创建Message组件
const createMessage = (message: string, type: MessageType, timeout = 2000) => {
  const messageInstance = createApp(Message, {
    message,
    type
  })

  // 挂载节点
  const mountNode = document.createElement('div')
  document.body.appendChild(mountNode)
  messageInstance.mount(mountNode)

  // 2s后销毁
  setTimeout(() => {
    messageInstance.unmount()
    document.body.removeChild(mountNode)
  }, timeout)
}

export default createMessage
