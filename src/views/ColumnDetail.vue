<template>
  <div class="column-deital-page w-75 mx-auto">
    <div
      class="column-info row mb-4 border-bottom pb-4 align-items-center"
      v-if="column"
    >
      <div class="col-3 text-center">
        <img
          :src="column.avatar && column.avatar.url"
          :alt="column.title"
          class="rounded-circle border w-100"
        />
      </div>
      <div class="col-9">
        <h4>{{ column.title }}</h4>
        <p class="text-muted">{{ column.description }}</p>
      </div>
    </div>
    <PostList :list="postList" />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
// store
import { useStore } from 'vuex'
import { GlobalDataProps } from '../store'
// 文章
import PostList from '../components/PostList.vue'

export default defineComponent({
  components: {
    PostList
  },
  setup() {
    // 路由
    const route = useRoute()
    // store
    const store = useStore<GlobalDataProps>()

    const currentId = route.params.id
    onMounted(() => {
      // 获取专栏信息
      store.dispatch('fetchColumn', currentId)
      // 获取专栏下的文章
      store.dispatch('fetchPosts', currentId)
    })
    // 获取当前专栏
    const column = computed(() => store.getters.getColumnById(currentId))
    // 获取当前专栏下的文章
    const postList = computed(() => store.getters.getPostsByCid(currentId))
    return {
      route,
      column,
      postList
    }
  }
})
</script>

<style scoped></style>
