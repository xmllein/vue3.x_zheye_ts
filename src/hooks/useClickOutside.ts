import { ref, onMounted, onUnmounted, Ref } from 'vue'

const useClickOutside = (elementRef: Ref<null | HTMLElement>) => {
  const isClickOutside = ref(false)

  const handler = (e: MouseEvent) => {
    if (elementRef.value) {
      if (
        elementRef.value.contains(e.target as HTMLElement) &&
        isClickOutside.value
      ) {
        isClickOutside.value = false
      } else {
        isClickOutside.value = true
      }
    }
  }

  // 监听点击事件
  onMounted(() => {
    document.addEventListener('click', handler)
  })

  // 移除监听
  onUnmounted(() => {
    document.removeEventListener('click', handler)
  })

  return isClickOutside
}

export default useClickOutside
