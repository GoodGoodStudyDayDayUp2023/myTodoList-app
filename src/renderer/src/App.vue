<template>
  <div class="app">
    <NavBar />
    <main class="content">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import NavBar from './components/NavBar.vue'
import { onMounted } from 'vue'


onMounted( () => {
})

</script>

<style lang="scss" scoped>
.app {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden; // 禁止 app 整体滚动
  background-color: #f3f4f6;
  border-radius: 12px; // 对应 navbar 的顶部圆角

  .content {
    flex: 1; // 占满 navbar 以下所有剩余高度
    overflow: hidden; // 自身不滚动，交给各页面内部处理
    min-height: 0; // flex 子项必须加，否则 overflow 不生效
  }
}
</style>