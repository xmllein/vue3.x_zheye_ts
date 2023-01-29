<template>
  <div class="login-page">
    <ValidateForm @form-submit="onFormSubmit">
      <div class="mb-3">
        <label class="form-label">邮箱地址</label>
        <ValidateInput
          :rules="emailRules"
          v-model="emailVal"
          type="text"
          placeholder="请输入邮箱地址"
        />
      </div>
      <div class="mb-3">
        <label class="form-label">密码</label>
        <ValidateInput
          :rules="passwordRules"
          v-model="passwordVal"
          type="password"
          placeholder="请输入密码"
        />
      </div>
      <template v-slot:submit>
        <button type="submit" class="btn btn-primary btn-block btn-large">
          登录
        </button>
      </template>
    </ValidateForm>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import ValidateInput, { RulesProps } from '../base/ValidateInput.vue'
import ValidateForm from '../base/ValidateForm.vue'
import createMessage from '@/base/createMessage'
export default defineComponent({
  components: {
    ValidateInput,
    ValidateForm
  },
  setup() {
    const emailVal = ref('')
    const emailRules: RulesProps = [
      {
        type: 'required',
        message: '请输入正确的邮箱地址'
      },
      {
        type: 'email',
        message: '请输入正确的邮箱地址'
      }
    ]

    const passwordVal = ref('')
    const passwordRules: RulesProps = [
      {
        type: 'required',
        message: '请输入密码'
      }
    ]

    // 路由
    const router = useRouter()
    // store
    const store = useStore()
    // 提交
    const onFormSubmit = (result: boolean) => {
      if (result) {
        const payload = {
          email: emailVal.value,
          password: passwordVal.value
        }
        store
          .dispatch('loginAndFetch', payload)
          .then(() => {
            createMessage('登录成功，2秒后跳转到首页', 'success')
            setTimeout(() => {
              router.push('/')
            }, 2000)
          })
          .catch((e) => {
            console.log(e)
          })
      } else {
        console.log(`提交失败 ${result}`)
      }
    }
    return {
      onFormSubmit,
      emailVal,
      emailRules,
      passwordVal,
      passwordRules
    }
  }
})
</script>

<style scoped></style>
