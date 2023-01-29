<template>
  <form class="validate-form-container">
    <slot name="default"></slot>
    <div class="submit-area" @click.prevent="submitForm">
      <slot name="submit">
        <button type="submit" class="btn btn-primary">提交</button>
      </slot>
    </div>
  </form>
</template>

<script lang="ts">
import { defineComponent, onUnmounted } from 'vue'
import mitt, { Emitter } from 'mitt'

type Events = {
  [propName: string]: any
}

export const emitter: Emitter<Events> = mitt<Events>()

type ValidateFunc = () => boolean
export default defineComponent({
  emits: ['form-submit'],
  setup(props, context) {
    let funcArr: ValidateFunc[] = []

    const submitForm = () => {
      const result = funcArr.map((func) => func()).every((result) => result)
      // 通过 emit 触发 form-submit 事件
      context.emit('form-submit', result)
    }

    // 模拟事件传递
    const callback = (func: ValidateFunc) => {
      funcArr.push(func)
    }
    // 订阅事件
    emitter.on('form-item-created', callback)

    // 卸载
    onUnmounted(() => {
      emitter.off('form-item-created', callback)
      funcArr = []
    })

    return {
      submitForm
    }
  }
})
</script>

<style scoped></style>
