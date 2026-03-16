<template>
  <div class="win-controls">
    <!-- <img class="normal-btn" @click="minimize" src="@/assets/images/minimize.png" />
    <img class="normal-btn" @click="maximize" src="@/assets/images/maximize.png" />
    <img class="close-btn" @click="close" :src="isCloseHover ? closeHoverIcon : closeIcon"
      @mouseenter="isCloseHover = true" @mouseleave="isCloseHover = false" /> -->
    <template v-for="item in opList">
      <img class="normal-btn" @click="minimize" src="@/assets/images/minimize.png" />
    </template>
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, nextTick, watch } from "vue"
const { proxy } = getCurrentInstance();
import { useRouter, useRoute } from 'vue-router';
const router = useRouter();
const route = useRoute();
import minimizeIcon from "@/assets/images/minimize.png"
import minimizeHoverIcon from "@/assets/images/minimize_hover.png"
import maximizeIcon from "@/assets/images/maximize.png"
import maximizeHoverIcon from "@/assets/images/maximize_hover.png"
import restoreIcon from "@/assets/images/restore.png"
import restoreHoverIcon from "@/assets/images/restore_hover.png"
import closeIcon from "@/assets/images/close.png"
import closeHoverIcon from "@/assets/images/close_hover.png"

const isCloseHover = ref(false)


const opList = ref([
  { icon: minimizeIcon, hoverIcon: minimizeHoverIcon, opCode: 1 },
  { icon: maximizeIcon, hoverIcon: maximizeHoverIcon, opCode: 2 },
  { icon: restoreIcon, hoverIcon: restoreHoverIcon, opCode: 3 },
  { icon: closeIcon, hoverIcon: closeHoverIcon, opCode: 0 },
])

const minimize = () => window.electronAPI.minimize()
const maximize = () => window.electronAPI.maximize()
const close = () => window.electronAPI.close()


</script>

<style scoped>
.win-controls {
  display: flex;
  gap: 12px;
  margin-right: 23px;
  -webkit-app-region: no-drag;

  img {
    width: 28px;
    height: 28px;
    border: none;
    background: transparent;
    cursor: pointer;
    padding: 4px;
  }

  img:hover {
    background: #f3f4f6;
  }

  .normal-btn {
    border-radius: 10px;
    padding: 4px;
    background: #fde2e2;
    color: white;
  }

  .close-btn:hover {
    border-radius: 10px;
    padding: 4px;
    background: #fde2e2;
    color: white;
  }
}
</style>