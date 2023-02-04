<template>
  <div class="create-post-page">
    <h4>{{ isEditMode ? '编辑文章' : '新建文章' }}</h4>
    <uploader
      action="/api/upload"
      class="d-flex align-items-center justify-content-center bg-light text-seceondary w-100 my-4"
      :before-upload="uploadCheck"
      :uploaded="uploadedData"
      @file-uploaded-success="onFileUploadSuccess"
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
          <img :src="dataProps.uploadedData.data.url" alt="" />
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
import { defineComponent, ref, onMounted } from 'vue'
// store
import { useStore } from 'vuex'
import { GlobalDataProps } from '@/store'
// router
import { useRouter, useRoute } from 'vue-router'
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
    const route = useRoute()
    const queryId = route.query.id
    const isEditMode = !!queryId // 两个!!转换为 boolean
    // 上传图片
    const uploadedData = ref()
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

    // 组件挂载完成
    onMounted(() => {
      if (isEditMode) {
        store
          .dispatch('fetchPost', queryId)
          .then((rawData: ResponseType<PostProps>) => {
            const currentPost = rawData.data
            const { image, title, content } = currentPost
            titleval.value = title
            contentval.value = content || ''
            if (image) {
              uploadedData.value = { data: image }
            }
          })
      }
    })

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
        const { column, _id } = store.state.user
        if (column) {
          const newPost: PostProps = {
            title: titleval.value,
            content: contentval.value,
            createdAt: new Date().toLocaleString(),
            column,
            author: _id
          }
          // 有图片
          if (imageId) {
            newPost.image = imageId
          }
          const actionName = isEditMode ? 'updatePost' : 'createPost'
          const sendData = isEditMode
            ? {
                id: queryId,
                payload: newPost
              }
            : newPost
          // 提交文章
          store.dispatch(actionName, sendData).then(() => {
            createMessage('文章发表成功，2秒后跳转到文章', 'success', 2000)
            // 跳转到文章详情页
            setTimeout(() => {
              router.push({ name: 'column', params: { id: column } })
            }, 2000)
          })
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
      onFileUploadSuccess,
      isEditMode,
      uploadedData
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
