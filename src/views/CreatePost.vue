<template>
  <div class="create-post-page">
    <h4>新建文章</h4>
    <uploader
      action="/api/upload"
      class="d-flex align-items-center justify-content-center bg-light text-seceondary w-100 my-4"
      :before-upload="uploadCheck"
      @file-upload-success="onFileUploadSuccess"
    >
      <h2>点击上传图片</h2>
      <!-- 上传中 -->
      <template #loading>
        <div class="d-flex">
          <div class="spinner-border text-secendary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <h2>正在上传</h2>
        </div>
      </template>
      <!-- 上传成功 -->
      <template #uploaded="dataProps">
        <div class="uploaded-area">
          <img :src="dataProps.uploadData.data.url" alt="" />
          <h3>重新上传</h3>
        </div>
      </template>
    </uploader>
    <ValidateForm @form-submit="onFormSubmit">
      <div class="mb-3">
        <ValidateInput
          label="标题"
          type="text"
          placeholder="请输入文章标题"
          v-model="titleval"
          :rules="titleRules"
        />
      </div>
      <div class="mb-3">
        <ValidateInput
          label="内容"
          rows="10"
          tag="textarea"
          placeholder="请输入文章内容"
          v-model="contentval"
          :rules="contentRules"
        />
      </div>
      <template v-slot:submit>
        <button class="btn btn-primary btn-large">发表文章</button>
      </template>
    </ValidateForm>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
// store
import { useStore } from 'vuex'
import { GlobalDataProps } from '@/store'
// router
import { useRouter } from 'vue-router'
import { PostProps, ResponseType, ImageProps } from '@/testData'
// uploader 组件
import Uploader from '@/base/Uploader.vue'
import ValidateInput, { RulesProps } from '../base/ValidateInput.vue'
import ValidateForm from '../base/ValidateForm.vue'
import createMessage from '@/base/createMessage'
// 上传文件校验
import { beforeUploadCheck } from '@/helper'
export default defineComponent({
  components: {
    ValidateInput,
    ValidateForm,
    Uploader
  },
  setup() {
    // 标题
    const titleval = ref('')
    const titleRules: RulesProps = [
      {
        type: 'required',
        message: '请输入文章标题'
      }
    ]

    // 内容
    const contentval = ref('')
    const contentRules: RulesProps = [
      {
        type: 'required',
        message: '请输入文章内容'
      }
    ]
    // 图片id
    let imageId = ''
    // store
    const store = useStore<GlobalDataProps>()
    // router
    const router = useRouter()

    // 上传成功
    const onFileUploadSuccess = (rawData: ResponseType<ImageProps>) => {
      if (rawData.data._id) {
        imageId = rawData.data._id
      }
    }
    // 表单提交
    const onFormSubmit = (result: boolean) => {
      if (result) {
        // 专栏
        const { column } = store.state.user
        if (column) {
          const newPost: PostProps = {
            _id: new Date().getTime() + '',
            title: titleval.value,
            content: contentval.value,
            createdAt: new Date().toLocaleString(),
            column
          }
          // 有图片
          if (imageId) {
            newPost.image = imageId
          }
          // 提交文章
          store.commit('createPost', newPost)
          // 跳转到文章详情页
          router.push({ name: 'column', params: { id: column } })
        }
      }
    }

    // 上传文件校验
    const uploadCheck = (file: File) => {
      const result = beforeUploadCheck(file, {
        format: ['image/jpeg', 'image/png'],
        size: 1
      })
      const { passed, error } = result

      if (error === 'format') {
        createMessage('上传图片只能是 JPG/PNG 格式!', 'error')
      }
      if (error === 'size') {
        createMessage('上传图片大小不能超过 1MB!', 'error')
      }
      return passed
    }
    return {
      onFormSubmit,
      titleval,
      titleRules,
      contentval,
      contentRules,
      uploadCheck,
      onFileUploadSuccess
    }
  }
})
</script>

<style>
.create-post-page .file-upload-container {
  height: 200px;
  cursor: pointer;
  overflow: hidden;
}
.create-post-page .file-upload-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.uploaded-area {
  position: relative;
}
.uploaded-area:hover h3 {
  display: block;
}
.uploaded-area h3 {
  display: none;
  position: absolute;
  color: #999;
  text-align: center;
  width: 100%;
  top: 50%;
}
</style>
