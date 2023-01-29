<template>
  <div class="file-upload">
    <div
      class="file-upload-container"
      @click.prevent="triggerUpload"
      v-bind="$attrs"
    >
      <!-- 上传中 -->
      <slot v-if="fileStatus === 'loading'" name="loading">
        <button class="btn btn-primary">正在上传...</button>
      </slot>
      <!-- 上传成功 -->
      <slot
        v-else-if="fileStatus === 'success'"
        name="uploaded"
        :uploadedData="uploadedData"
      >
        <button class="btn btn-primary">上传成功</button>
      </slot>
      <!-- 默认展示 -->
      <slot v-else name="default">
        <button class="btn btn-primary">点击文件</button>
      </slot>
    </div>
    <input
      type="file"
      class="file-input d-none"
      ref="fileInput"
      @change="handleFileChange"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, PropType } from 'vue'
import axios from '../libs/http'

// 上传文件状态
type UploadStatus = 'ready' | 'loading' | 'success' | 'error'
// 上传前钩子函数
type CheckFunction = (file: File) => boolean | Promise<boolean>

export default defineComponent({
  name: 'Uploader',
  props: {
    action: {
      type: String,
      required: true
    },
    beforeUpload: {
      type: Function as PropType<CheckFunction>
    }
  },
  setup(props, context) {
    // 文件输入框
    const fileInput = ref<HTMLInputElement | null>(null)
    // 默认状态
    const fileStatus = ref<UploadStatus>('ready')
    // 上传成功数据
    const uploadedData = ref()

    // 触发点击上传文件
    const triggerUpload = () => {
      if (fileInput.value) {
        fileInput.value.click()
      }
    }
    // 文件改变
    const handleFileChange = (e: Event) => {
      const currentTarget = e.target as HTMLInputElement
      const files = currentTarget.files
      if (files) {
        // 转换数组
        const uploadedFiles = Array.from(files)
        const uploadedFile = uploadedFiles[0]

        // 上传前钩子函数
        if (props.beforeUpload) {
          const result = props.beforeUpload(uploadedFile)
          if (!result) {
            return
          }
        }
        // 上传中
        fileStatus.value = 'loading'
        // 组装数据
        const formData = new FormData()
        formData.append('file', uploadedFile)
        axios
          .post(props.action, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
          .then((resp) => {
            // 上传成功
            fileStatus.value = 'success'
            uploadedData.value = resp.data
            // 触发上传成功事件
            context.emit('file-uploaded-success', resp.data)
          })
          .catch((err) => {
            // 上传失败
            fileStatus.value = 'error'
            // 触发上传失败事件
            context.emit('file-uploaded-error', { err })
          })
          .finally(() => {
            // 清空数据
            if (fileInput.value) {
              fileInput.value.value = ''
            }
          })
      }
    }
    return {
      fileStatus,
      fileInput,
      triggerUpload,
      handleFileChange,
      uploadedData
    }
  }
})
</script>

<style scoped></style>
