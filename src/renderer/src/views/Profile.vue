<template>
  <div class="profile-view">
    <div class="scroll-body">

      <div class="stat-grid">
        <StatCard type="pending" label="待完成" :value="stats.pending" />
        <StatCard type="done" label="已完成" :value="stats.done" />
        <StatCard type="rate" label="完成率" :value="`${stats.rate}%`" />
        <StatCard type="week" label="本周任务" :value="stats.week" />
      </div>

      <div class="detail-row">
        <div class="detail-card">
          <h3 class="card-title">今日概览</h3>
          <div class="overview-list">
            <div class="overview-item">
              <span class="ov-label">今日任务</span>
              <span class="ov-value">{{ stats.todayTotal }} 个</span>
            </div>
            <div class="overview-item">
              <span class="ov-label">今日已完成</span>
              <span class="ov-value done">{{ stats.todayDone }} 个</span>
            </div>
            <div class="overview-item">
              <span class="ov-label">今日待完成</span>
              <span class="ov-value pending">{{ stats.todayPending }} 个</span>
            </div>
          </div>
        </div>

        <div class="detail-card">
          <h3 class="card-title">总体进度</h3>
          <div class="progress-header">
            <span class="progress-label">已完成 {{ stats.done }}/{{ stats.total }}</span>
            <span class="progress-pct">{{ stats.rate }}%</span>
          </div>
          <div class="progress-bar-wrap">
            <div class="progress-bar-fill" :style="{ width: `${stats.rate}%` }"></div>
          </div>
          <p class="progress-tip">{{ progressTip }}</p>
        </div>
      </div>

      <div class="footer-card">
        <p class="footer-title">备忘录助手 v1.0</p>
        <p class="footer-sub">让每一天都井井有条 ✨</p>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue"
import { toDateStr, normalizeRow } from "@/utils/tool"
import StatCard from "@/components/StatCard.vue"

const todayStr = toDateStr()

const getWeekStart = () => {
  const d = new Date()
  const day = d.getDay() || 7
  d.setDate(d.getDate() - day + 1)
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}

// ── 数据 ─────────────────────────────────────────────
const allTodos = ref([])
const todayTodos = ref([])

const loadData = async () => {
  const allRows = await window.electronAPI.getAll()
  const todayRows = await window.electronAPI.getByDate(todayStr)
  allTodos.value = allRows.map(normalizeRow)
  todayTodos.value = todayRows.map(normalizeRow)
}

onMounted(loadData)

// ── 统计计算 ─────────────────────────────────────────
const stats = computed(() => {
  const all = allTodos.value
  const today = todayTodos.value
  const done = all.filter(i => i.done).length
  const pending = all.length - done
  const rate = all.length ? Math.round((done / all.length) * 100) : 0
  const weekStart = getWeekStart()
  const week = all.filter(i => i.createdAt >= weekStart).length  // ← 转换后用 camelCase

  return {
    total: all.length,
    done,
    pending,
    rate,
    week,
    todayTotal: today.length,
    todayDone: today.filter(i => i.done).length,
    todayPending: today.filter(i => !i.done).length,
  }
})

const progressTip = computed(() => {
  const r = stats.value.rate
  if (r === 0) return "🚀 开始行动吧！"
  if (r < 30) return "💪 加油，继续前进！"
  if (r < 60) return "🔥 状态不错，保持！"
  if (r < 100) return "🌟 快到终点了！"
  return "🎉 全部完成，太棒了！"
})
</script>

<style lang="scss" scoped>
.profile-view {
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  .scroll-body {
    flex: 1;
    overflow-y: auto;
    padding: 20px 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    box-sizing: border-box;

    &::-webkit-scrollbar {
      width: 5px;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background: #e0e0e8;
      border-radius: 99px;
    }

    &::-webkit-scrollbar-thumb:hover {
      background: #c4c4d0;
    }
  }

  .stat-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }

  .detail-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;

    .detail-card {
      background: #fff;
      border-radius: 16px;
      padding: 20px 24px;

      .card-title {
        font-size: 16px;
        font-weight: 700;
        color: #111827;
        margin: 0 0 16px;
      }
    }
  }

  .overview-list {
    display: flex;
    flex-direction: column;

    .overview-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 13px 0;
      border-bottom: 1px solid #f3f4f6;

      &:last-child {
        border-bottom: none;
      }

      .ov-label {
        font-size: 14px;
        color: #6b7280;
      }

      .ov-value {
        font-size: 14px;
        font-weight: 600;
        color: #111827;

        &.done {
          color: #22c55e;
        }

        &.pending {
          color: #6366f1;
        }
      }
    }
  }

  .progress-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;

    .progress-label {
      font-size: 14px;
      color: #6b7280;
    }

    .progress-pct {
      font-size: 14px;
      font-weight: 700;
      color: #6d4ef7;
    }
  }

  .progress-bar-wrap {
    height: 10px;
    background: #e5e7eb;
    border-radius: 99px;
    overflow: hidden;
    margin-bottom: 20px;

    .progress-bar-fill {
      height: 100%;
      background: linear-gradient(90deg, #6d4ef7, #8b5cf6);
      border-radius: 99px;
      transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
      min-width: 4px;
    }
  }

  .progress-tip {
    font-size: 13px;
    color: #9ca3af;
    text-align: center;
    margin: 0;
  }

  .footer-card {
    background: #f5f3ff;
    border-radius: 16px;
    padding: 20px;
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: 6px;

    .footer-title {
      font-size: 14px;
      font-weight: 600;
      color: #4b5563;
      margin: 0;
    }

    .footer-sub {
      font-size: 13px;
      color: #9ca3af;
      margin: 0;
    }
  }
}
</style>