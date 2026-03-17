<template>
  <div class="win-controls">
    <template v-for="item in visibleOpList" :key="item.opCode">
      <img :class="item.opCode === 0 ? 'close-btn' : 'normal-btn'" :src="item.isHover ? item.hoverIcon : item.icon"
        @click="handleClick(item.opCode)" @mouseenter="item.isHover = true" @mouseleave="item.isHover = false" />
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue"

import minimizeIcon from "@/assets/images/minimize.png"
import minimizeHoverIcon from "@/assets/images/minimize_hover.png"
import maximizeIcon from "@/assets/images/maximize.png"
import maximizeHoverIcon from "@/assets/images/maximize_hover.png"
import restoreIcon from "@/assets/images/restore.png"
import restoreHoverIcon from "@/assets/images/restore_hover.png"
import closeIcon from "@/assets/images/close.png"
import closeHoverIcon from "@/assets/images/close_hover.png"

const isMaximized = ref(false)

const opList = ref([
  { icon: minimizeIcon, hoverIcon: minimizeHoverIcon, opCode: 1, isHover: false },
  { icon: maximizeIcon, hoverIcon: maximizeHoverIcon, opCode: 2, isHover: false }, // 未最大化时显示
  { icon: restoreIcon, hoverIcon: restoreHoverIcon, opCode: 3, isHover: false }, // 最大化后显示
  { icon: closeIcon, hoverIcon: closeHoverIcon, opCode: 0, isHover: false },
])

// 根据窗口状态过滤按钮：最大化时显示 restore(3)，否则显示 maximize(2)
const visibleOpList = computed(() =>
  opList.value.filter(item => {
    if (item.opCode === 2) return !isMaximized.value  // maximize 按钮：未最大化时显示
    if (item.opCode === 3) return isMaximized.value   // restore 按钮：最大化后显示
    return true                                        // minimize / close 始终显示
  })
)

const handleClick = (opCode) => {
  switch (opCode) {
    case 0: window.electronAPI.close(); break
    case 1: window.electronAPI.minimize(); break
    case 2:
    case 3:
      isMaximized.value = !isMaximized.value
      window.electronAPI.maximize();
      break  // maximize/restore 调同一个 toggle 接口
  }
}

// 监听主进程推送的窗口状态变化
const onMaximizeChange = (val) => { isMaximized.value = val }

onMounted(() => {
  // 初始化当前窗口状态（需要主进程提供此接口）
  window.electronAPI?.isMaximized?.().then(val => {
    isMaximized.value = val
  })
  // 监听最大化 / 还原事件
  window.electronAPI?.onMaximizeChange?.(onMaximizeChange)
})

onUnmounted(() => {
  window.electronAPI?.offMaximizeChange?.(onMaximizeChange)
})
</script>

<style scoped>
.win-controls {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-right: 23px;
  -webkit-app-region: no-drag;

  img {
    width: 28px;
    height: 28px;
    border: none;
    background: transparent;
    cursor: pointer;
    padding: 4px;
    box-sizing: border-box;
    border-radius: 6px;
    transition: background 0.15s ease;
  }

  .normal-btn:hover {
    background: white;
  }

  .close-btn:hover {
    background: #fde2e2;
  }
}
</style>