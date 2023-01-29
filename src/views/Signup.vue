<template>
  <div class="signup-page mx-auto p-3 w-330">
    <h5 class="my-4 text-center">注册者也账户</h5>
    <ValidateForm @form-submit="onFormSubmit">
      <div class="mb-3">
        <label class="form-label">邮箱地址</label>
        <ValidateInput
          type="text"
          v-model="emailVal"
          :rules="emailRules"
          placeholder="请输入邮箱地址"
        />
      </div>
      <div class="mb-3">
        <label class="form-label">昵称</label>
        <ValidateInput
          type="text"
          v-model="nickNameVal"
          :rules="nickNameRules"
          placeholder="请输入密码"
        />
      </div>
      <div class="mb-3">
        <label class="form-label">密码</label>
        <ValidateInput
          type="password"
          v-model="passwordVal"
          :rules="passwordRules"
          placeholder="请输入密码"
        />
      </div>
      <div class="mb-3">
        <label class="form-label">确认密码</label>
        <ValidateInput
          type="password"
          v-model="repeatPasswordVal"
          :rules="repeatPasswordRules"
          placeholder="请再次输入密码"
        />
      </div>
    </ValidateForm>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import ValidateInput, { RulesProps } from '../base/ValidateInput.vue'
import ValidateForm from '../base/ValidateForm.vue'
// store
import { useStore } from 'vuex'
// router
import { useRouter } from 'vue-router'
import createMessage from '@/base/createMessage'
export default defineComponent({
  components: {
    ValidateInput,
    ValidateForm
  },
  setup() {
    // 邮箱
    const emailVal = ref('')
    const emailRules: RulesProps = [
      {
        type: 'required',
        message: '请输入邮箱地址'
      },
      {
        type: 'email',
        message: '请输入正确的邮箱地址'
      }
    ]
    // 昵称
    const nickNameVal = ref('')
    const nickNameRules: RulesProps = [
      {
        type: 'required',
        message: '请输入昵称'
      }
    ]
    // 密码
    const passwordVal = ref('')
    const passwordRules: RulesProps = [
      {
        type: 'required',
        message: '请输入密码'
      }
    ]
    // 确认密码
    const repeatPasswordVal = ref('')
    const repeatPasswordRules: RulesProps = [
      {
        type: 'required',
        message: '请再次输入密码'
      },
      {
        type: 'custom',
        validator: () => {
          return passwordVal.value === repeatPasswordVal.value
        },
        message: '两次输入的密码不一致'
      }
    ]
    // store
    const store = useStore()
    // router
    const router = useRouter()
    // 表单提交
    const onFormSubmit = (result: boolean) => {
      if (result) {
        const payload = {
          email: emailVal.value,
          nickName: nickNameVal.value,
          password: passwordVal.value
        }
        store
          .dispatch('register', payload)
          .then(() => {
            createMessage('注册成功， 正在跳转到登录页面', 'success')
            setTimeout(() => {
              router.push('/login')
            }, 1000)
          })
          .catch((e) => {
            console.log(e)
          })
      } else {
        console.log('提交失败')
      }
    }
    return {
      onFormSubmit,
      emailVal,
      emailRules,
      nickNameVal,
      nickNameRules,
      passwordVal,
      passwordRules,
      repeatPasswordVal,
      repeatPasswordRules
    }
  }
})
</script>

<style scoped></style>
