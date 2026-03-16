<template>
  <div class="navbar">
    <div class="menu-box">
      <div class="img-box">
        <img class="img-logo" src="@/assets/images/logo.png" alt="">
        <div class="text-box">
          <span class="title-text">{{ activeMenu.name }}</span>
          <span class="description-text">{{ activeMenu.description }}</span>
        </div>
      </div>

      <div class="menu-list">
        <template v-for="item in menuList">
          <div class="menu-item">
            <img class="menu-icon" :src="item.icon" alt="">
            <span>{{ item.name }}</span>
          </div>
        </template>
      </div>
    </div>

    <div class="divider"></div>
    <WinOp></WinOp>
  </div>
</template>

<script setup>
import WinOp from "./WinOp.vue";
import todayIcon from '@/assets/images/today.png'
import calendarIcon from '@/assets/images/calendar.png'
import profileIcon from '@/assets/images/profile.png'

import { ref, reactive, getCurrentInstance, nextTick, watch, onMounted } from "vue"
const { proxy } = getCurrentInstance();
import { useRouter, useRoute } from 'vue-router';
const router = useRouter();
const route = useRoute();


const menuList = ref([
  { name: "今日待办", icon: todayIcon, path: "/today", description: "管理今天的任务清单" },
  { name: "日历", icon: calendarIcon, path: "/calendar", description: "查看不同日期的待办事项" },
  { name: "我的", icon: profileIcon, path: "/profile", description: "个人数据统计与分析" },
])

const activeMenu = ref({})

onMounted(() => {
  activeMenu.value = menuList.value[0]
  console.log(activeMenu.value)
})

</script>

<style lang="scss" scoped>
.navbar {
  height: 60px;
  -webkit-app-region: drag;
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
  /* 背景颜色（浅灰白） */
  background-color: #f3f4f6;

  /* 顶部圆角 */
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;

  .menu-box {
    height: 100%;
    align-items: center;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 80%;

    .img-box {
      display: flex;
      flex-direction: row;
      padding: 0 0 0 15px;
      align-items: center;

      .img-logo {
        width: 50px;
        height: 48px;
        margin-right: 6px;
      }

      .text-box {
        display: flex;
        flex-direction: column;

        .title-text {
          font-weight: 800;
          font-size: 18px;
        }

        .description-text {
          font-size: 12px;
        }
      }
    }

    .menu-list {
      -webkit-app-region: no-drag;
      display: flex;
      flex-direction: row;
      align-items: center;

      .menu-item {
        display: flex;
        flex-direction: row;
        align-items: center;
        cursor: pointer;
        margin-left: 30px;

        .menu-icon {
          width: 30px;
          height: 30px;
        }
      }

    }
  }

  .divider {
    width: 2px;
    height: 25px;
    background-color: #d0d0d0;
  }

}
</style>
