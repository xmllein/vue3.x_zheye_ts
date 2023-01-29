<template>
  <nav class="navbar navbar-dark bg-primary justify-content-between mb-4 px-4">
    <router-link :to="'/'" class="navbar-brand">者也专栏</router-link>
    <ul class="list-inline mb-0" v-if="!user.isLogin">
      <li class="list-inline-item">
        <router-link to="/login" class="btn btn-outline-light my-2"
          >登录</router-link
        >
      </li>
      <li class="list-inline-item">
        <router-link to="/signup" class="btn btn-outline-light my-2"
          >注册</router-link
        >
      </li>
    </ul>
    <ul v-else>
      <li class="list-inline-item mb-0">
        <Dropdown :title="`你好 ${user.nickName}`">
          <DropdownItem
            ><a href="#" class="dropdown-item">新建文章</a></DropdownItem
          >
          <DropdownItem disabled
            ><a href="#" class="dropdown-item">编辑资料</a></DropdownItem
          >
          <DropdownItem
            ><a href="#" class="dropdown-item" @click.prevent="handleLogout"
              >退出登录</a
            ></DropdownItem
          >
        </Dropdown>
      </li>
    </ul>
  </nav>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import type { PropType } from 'vue'
// Dropdown 组件
import Dropdown from '../base/Dropdown.vue'
// DropdownItem 组件
import DropdownItem from '../base/DropdownItem.vue'

import { UserProps } from '@/testData'

// store
import { useStore } from 'vuex'
// router
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'GlobalHeader',
  components: {
    Dropdown,
    DropdownItem
  },
  props: {
    user: {
      type: Object as PropType<UserProps>,
      required: true
    }
  },
  setup() {
    const store = useStore()
    const router = useRouter()
    // 处理退出登录
    const handleLogout = () => {
      console.log('退出登录')
      store.commit('logout')
      router.push({ name: 'home' })
    }
    return { handleLogout }
  }
})
</script>

<style scoped></style>
