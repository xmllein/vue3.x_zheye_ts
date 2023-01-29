<template>
  <div class="validate-input-container pb-3">
    <input
      v-if="tag !== 'textarea'"
      class="form-control"
      :class="{ 'is-invalid': inputRef.error }"
      :value="inputRef.val"
      @blur="validateInput"
      @input="updateValue"
      v-bind="$attrs"
    />
    <textarea
      v-else
      class="form-control"
      :class="{ 'is-invalid': inputRef.error }"
      :value="inputRef.val"
      @blur="validateInput"
      @input="updateValue"
      v-bind="$attrs"
    />
    <span v-if="inputRef.error" class="invalid-feedback">{{
      inputRef.message
    }}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted } from 'vue'
import type { PropType } from 'vue'
import { RuleProps } from '@/testData'
// 导入事件总线
import { emitter } from './ValidateForm.vue'
// email 正则
const emailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/

export type RulesProps = RuleProps[]

export type TagType = 'input' | 'textarea'

export default defineComponent({
  props: {
    rules: Array as PropType<RulesProps>,
    modelValue: String,
    tag: {
      type: String as PropType<TagType>,
      default: 'input'
    }
  },
  // 为了不让组件的属性传递到子组件上，需要设置为 false
  inheritAttrs: false,
  setup(props, context) {
    const inputRef = reactive({
      val: props.modelValue || '',
      error: false,
      message: ''
    })

    const updateValue = (e: Event) => {
      const targetValue = (e.target as HTMLInputElement).value
      inputRef.val = targetValue
      context.emit('update:modelValue', inputRef.val)
    }

    const validateInput = () => {
      if (props.rules) {
        const allPassed = props.rules.every((rule) => {
          let passed = true
          inputRef.message = rule.message
          switch (rule.type) {
            case 'email':
              passed = emailReg.test(inputRef.val)
              break
            case 'required':
              passed = inputRef.val.trim() !== ''
              break
            case 'custom':
              passed = passed = rule.validator ? rule.validator() : true
              break
            default:
              break
          }

          return passed
        })
        inputRef.error = !allPassed
        return allPassed
      }
      return true
    }

    onMounted(() => {
      // 发布事件
      emitter.emit('form-item-created', validateInput)
    })

    return {
      inputRef,
      validateInput,
      updateValue
    }
  }
})
</script>

<style scoped></style>
