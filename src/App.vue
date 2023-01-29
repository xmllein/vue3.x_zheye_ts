<template>
  <div class="container">
    <GobalHeader :user="currentUser" />
    <Loading v-if="isLoading" text="拼命加载中" background="rgba(0,0,0, 0.8)" />
    <h1>{{ error.message }}</h1>
    <router-view></router-view>
    <footer class="text-center py-4 text-secondary bg-light mt-6">
      <small>
        <ul class="list-inline mb-0">
          <li class="list-inline-item">© 2020 者也专栏</li>
          <li class="list-inline-item">课程</li>
          <li class="list-inline-item">文档</li>
          <li class="list-inline-item">联系</li>
          <li class="list-inline-item">更多</li>
        </ul>
      </small>
    </footer>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
// 导入bootstrap样式
import 'bootstrap/dist/css/bootstrap.min.css'
// GlobalHeader 组件
import GobalHeader from './components/GlobalHeader.vue'
// Loading
import Loading from './components/Loading.vue'
// store
import { useStore } from 'vuex'
import { GlobalDataProps } from './store'

export default defineComponent({
  name: 'App',
  components: {
    GobalHeader,
    Loading
  },
  setup() {
    const store = useStore<GlobalDataProps>()
    const currentUser = computed(() => store.state.user)
    const isLoading = computed(() => store.state.loading)
    const error = computed(() => store.state.error)
    return {
      currentUser,
      isLoading,
      error
    }
  }
})
</script>

<style></style>
