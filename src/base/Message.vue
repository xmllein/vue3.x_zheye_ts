<template>
  <teleport to="#message">
    <div
      v-if="isVisiable"
      class="alert message-info fixed-top w-50 mx-auto d-flex justify-content-between mt-2"
      :class="classObject"
    >
      <span>{{ message }}</span>
      <button
        type="button"
        class="close"
        aria-label="Colse"
        @click.prevent=""
        hide
      >
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  </teleport>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue'
import { MessageType } from '@/testData'
import useDOMCreate from '@/hooks/useDomCreate'

export default defineComponent({
  name: 'Message',
  props: {
    message: String,
    type: {
      type: String as PropType<MessageType>,
      default: 'default'
    }
  },
  emits: ['close-message'],
  setup(props, context) {
    const classObject = {
      'alert-success': props.type === 'success',
      'alert-danger': props.type === 'error',
      'alert-primary': props.type === 'default'
    }
    // 创建#message元素
    useDOMCreate('message')
    // 是否可见
    const isVisiable = ref(true)

    // 关闭
    const hide = () => {
      isVisiable.value = false
      context.emit('close-message', true)
    }

    return {
      classObject,
      hide,
      isVisiable
    }
  }
})
</script>

<style scoped></style>
