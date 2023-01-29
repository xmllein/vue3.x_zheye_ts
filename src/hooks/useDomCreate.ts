import { onUnmounted } from 'vue'

/**
 * 创建一个dom节点
 * @param nodeId 节点id
 */
function createDOMCreate(nodeId: string) {
  const node = document.createElement('div')
  node.id = nodeId
  document.body.appendChild(node)
  onUnmounted(() => {
    document.body.removeChild(node)
  })
}

export default createDOMCreate
