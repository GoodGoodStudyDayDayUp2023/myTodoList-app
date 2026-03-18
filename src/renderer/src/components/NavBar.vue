<template>
  <div class="navbar">
    <div class="menu-box">
      <div class="img-box">
        <img class="img-logo" :src="logoImg" alt="logo" />
        <div class="text-box">
          <span class="title-text">{{ activeMenu?.name }}</span>
          <span class="description-text">{{ activeMenu?.description }}</span>
        </div>
      </div>

      <div class="menu-list">
        <div v-for="item in menuList" :key="item.path" :class="['menu-item', { active: isActive(item) }]"
          @click="handleMenuClick(item)">
          <!-- 激活时切换为 activeIcon -->
          <img :class="['menu-icon', { 'menu-mine': item.name === '我的' }]"
            :src="isActive(item) ? item.activeIcon : item.icon" :alt="item.name" />
          <span>{{ item.name }}</span>
        </div>
      </div>
    </div>

    <div class="divider"></div>
    <WinOp />
  </div>
</template>


<script setup>
import { ref, watch } from "vue"
import { useRouter, useRoute } from "vue-router"
import WinOp from "./WinOp.vue"


const router = useRouter()
const route = useRoute()

const logoImg = "./images/logo.png"  // 加这行

const menuList = ref([
  {
    name: "今日待办", path: "/today", description: "管理今天的任务清单",
    icon: "./images/today.png",
    activeIcon: "./images/today_active.png",
  },
  {
    name: "日历", path: "/calendar", description: "查看不同日期的待办事项",
    icon: "./images/calendar.png",
    activeIcon: "./images/calendar_active.png",
  },
  {
    name: "我的", path: "/profile", description: "个人数据统计与分析",
    icon: "./images/profile.png",
    activeIcon: "./images/profile_active.png",
  },
])

const syncActiveMenu = (path) =>
  menuList.value.find(item => item.path === path) ?? menuList.value[0]

const activeMenu = ref(syncActiveMenu(route.path))

watch(() => route.path, (path) => {
  activeMenu.value = syncActiveMenu(path)
})

const handleMenuClick = (item) => {
  if (item.path === route.path) return
  activeMenu.value = item
  router.push(item.path)
}

// 判断是否激活，供模板使用
const isActive = (item) => item.path === activeMenu.value?.path
</script>


<style lang="scss" scoped>
.navbar {
  height: 60px;
  -webkit-app-region: drag;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f3f4f6;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;

  .menu-box {
    height: 100%;
    display: flex;
    align-items: center;
    width: 80%;

    .img-box {
      display: flex;
      align-items: center;
      padding-left: 15px;

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
          color: #6b7280;
        }
      }
    }

    .menu-list {
      -webkit-app-region: no-drag;
      display: flex;
      align-items: center;
      margin-left: auto;

      .menu-item {
        display: flex;
        align-items: center;
        gap: 6px; // 替代 margin-right，更简洁
        cursor: pointer;
        margin-left: 8px;
        padding: 5px 16px 6px 10px;
        border-radius: 8px;
        transition: background 0.15s ease, color 0.15s ease;
        color: #6b7280;
        font-size: 16px;

        &:hover:not(.active) {
          background: #e5e7eb;
          color: #111827;
        }

        // 对齐截图：紫色实底 + 白字
        &.active {
          background: #6d4ef7;
          color: #ffffff;
          font-weight: 600;
        }

        .menu-icon {
          width: 26px;
          height: 26px;
          flex-shrink: 0;
          // 移除 filter，直接用 activeIcon 替换图片，更精准
        }

        .menu-mine {
          width: 22px;
          height: 22px;
          border-radius: 50%;
        }
      }
    }
  }

  .divider {
    width: 2px;
    height: 25px;
    background-color: #d0d0d0;
    flex-shrink: 0;
  }
}
</style>