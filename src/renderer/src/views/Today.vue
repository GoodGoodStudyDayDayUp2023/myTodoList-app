<template>
  <div class="today-view">
    <!-- 日期标题 -->
    <p class="today-date">{{ todayLabel }}</p>

    <!-- 统计卡片区 -->
    <div class="stat-row">
      <StatCard type="pending" label="待完成" :value="pendingList.length" />
      <StatCard type="done" label="已完成" :value="doneList.length" />
    </div>

    <!-- 添加输入框 -->
    <div class="add-bar">
      <input v-model="inputText" class="add-input" placeholder="添加今日待办..." @keydown.enter="addTodo" />
      <button class="add-btn" @click="addTodo">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="15" height="15">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        添加
      </button>
    </div>

    <!-- 列表区域 -->
    <div class="todo-list-box">
      <EmptyState v-if="todoList.length === 0" type="file" title="今天还没有待办事项" subtitle="添加一个开始吧！" />

      <!-- 待完成分组 -->
      <div v-if="pendingList.length > 0" class="todo-group">
        <p class="section-label">
          <span class="dot pending-dot"></span>
          待办事项 ({{ pendingList.length }})
        </p>
        <TransitionGroup name="todo" tag="div" class="todo-items">
          <div v-for="item in pendingList" :key="item.id" class="todo-item">
            <button :class="['checkbox', { checked: item.done }]" @click="toggleTodo(item)">
              <svg v-if="item.done" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="11"
                height="11">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </button>

            <div class="item-content">
              <input v-if="item.editing" class="edit-input" v-model="item.editText" @keydown.enter="confirmEdit(item)"
                @keydown.escape="cancelEdit(item)" @blur="confirmEdit(item)" v-focus />
              <span v-else class="item-text">{{ item.text }}</span>
              <span class="item-time">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="11" height="11"
                  style="margin-right:3px;flex-shrink:0">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                {{ formatTime(item.createdAt) }}
              </span>
            </div>

            <div class="item-actions">
              <button class="action-btn edit-btn" title="编辑" @click="startEdit(item)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </button>
              <button class="action-btn delete-btn" title="删除" @click="deleteTodo(item.id)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6l-1 14H6L5 6" />
                  <path d="M10 11v6" />
                  <path d="M14 11v6" />
                  <path d="M9 6V4h6v2" />
                </svg>
              </button>
            </div>
          </div>
        </TransitionGroup>
      </div>

      <!-- 已完成分组 -->
      <div v-if="doneList.length > 0" class="todo-group">
        <p class="section-label">
          <span class="dot done-dot"></span>
          已完成 ({{ doneList.length }})
        </p>
        <TransitionGroup name="todo" tag="div" class="todo-items">
          <div v-for="item in doneList" :key="item.id" class="todo-item done">
            <button :class="['checkbox', { checked: item.done }]" @click="toggleTodo(item)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="11" height="11">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </button>

            <div class="item-content">
              <span class="item-text">{{ item.text }}</span>
              <span class="item-time">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="11" height="11"
                  style="margin-right:3px;flex-shrink:0">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                {{ formatTime(item.createdAt) }}
              </span>
            </div>

            <div class="item-actions">
              <button class="action-btn delete-btn" title="删除" @click="deleteTodo(item.id)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6l-1 14H6L5 6" />
                  <path d="M10 11v6" />
                  <path d="M14 11v6" />
                  <path d="M9 6V4h6v2" />
                </svg>
              </button>
            </div>
          </div>
        </TransitionGroup>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue"
import StatCard from "@/components/StatCard.vue"
import EmptyState from "@/components/EmptyState.vue"
import { normalizeRow, toDateStr } from '@/utils/tool'
import { ElMessage } from 'element-plus'

// 自动聚焦指令
const vFocus = { mounted: (el) => el.focus() }

// 今日日期
const now = new Date()
const todayLabel = now.toLocaleDateString("zh-CN", {
  year: "numeric", month: "long", day: "numeric", weekday: "long"
})


const todoList = ref([])
const pendingList = computed(() => todoList.value.filter(i => !i.done))
const doneList = computed(() => todoList.value.filter(i => i.done))

const inputText = ref("")

const formatTime = (ts) => {
  const d = new Date(ts)
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}  ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

const addTodo = async () => {
  const text = inputText.value.trim()
  if (!text) return

  const createdAt = Date.now()
  const dateStr = toDateStr()
  const newTodo = await window.electronAPI.add(text, dateStr, createdAt)
  if (newTodo.success) {
    todoList.value.unshift(normalizeRow(newTodo.data))
    inputText.value = ""
  } else {
    ElMessage.error(newTodo.message || '添加失败，请重试')
  }

}

const toggleTodo = async (item) => {
  const success = await window.electronAPI.toggle(item.id, !item.done)
  if (success) {
    item.done = !item.done
  } else {
    console.error('toggle失败', item)
  }
}

const deleteTodo = async (id) => {
  const success = await window.electronAPI.delete(id)
  if (success) {
    todoList.value = todoList.value.filter(i => i.id !== id)
  } else {
    console.error('delete失败', id)
  }
}

const startEdit = (item) => {
  item.editText = item.text
  item.editing = true
}

const confirmEdit = (item) => {
  const text = item.editText.trim()
  if (text) item.text = text
  item.editing = false
}

const cancelEdit = (item) => {
  item.editing = false
}

onMounted(() => {
  getData()
})
const getData = async () => {
  const today = toDateStr()
  const dataList = await window.electronAPI.getByDate(today)
  todoList.value = dataList.map(item => normalizeRow(item))
}
</script>

<style lang="scss" scoped>
.today-view {
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  height: 100%;
  box-sizing: border-box;

  .today-date {
    font-size: 13px;
    color: #374151;
    font-weight: 500;
    margin: 0;
  }

  .stat-row {
    display: flex;
    gap: 14px;
  }

  .add-bar {
    display: flex;
    gap: 10px;

    .add-input {
      flex: 1;
      height: 44px;
      padding: 0 16px;
      border: 1.5px solid #e5e7eb;
      border-radius: 10px;
      font-size: 14px;
      outline: none;
      background: #fff;
      transition: border-color 0.15s, box-shadow 0.15s;
      color: #111827;

      &::placeholder {
        color: #9ca3af;
      }

      &:focus {
        border-color: #6d4ef7;
        box-shadow: 0 0 0 3px rgba(109, 78, 247, .08);
      }
    }

    .add-btn {
      height: 44px;
      padding: 0 20px;
      background: #6d4ef7;
      color: #fff;
      border: none;
      border-radius: 10px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: background 0.15s;
      white-space: nowrap;

      &:hover {
        background: #5b3ee0;
      }

      &:active {
        background: #4c34c4;
      }
    }
  }

  .todo-list-box {
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 16px;

    .todo-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .section-label {
      display: flex;
      align-items: center;
      gap: 7px;
      font-size: 14px;
      font-weight: 700;
      color: #1f2937;
      margin: 0;

      .dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        flex-shrink: 0;
      }

      .pending-dot {
        background: #6d4ef7;
      }

      .done-dot {
        background: #22c55e;
      }
    }

    .todo-items {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    // ── 单条待办 ──────────────────────────────────
    .todo-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 16px;
      background: #fff;
      border-radius: 12px;
      border: 1px solid #f0f0f5;
      transition: box-shadow 0.15s, border-color 0.15s;

      &:hover {
        box-shadow: 0 2px 10px rgba(0, 0, 0, .06);
        border-color: #e5e7eb;

        .item-actions {
          opacity: 1;
        }
      }

      &.done {
        opacity: 0.7;

        .item-text {
          text-decoration: line-through;
          color: #9ca3af;
        }
      }

      // Checkbox
      .checkbox {
        width: 18px;
        height: 18px;
        border-radius: 4px;
        border: 1.5px solid #d1d5db;
        background: #fff;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        transition: border-color 0.15s, background 0.15s;
        padding: 0;

        &:hover:not(.checked) {
          border-color: #6d4ef7;
        }

        &.checked {
          background: #6d4ef7;
          border-color: #6d4ef7;
          color: #fff;
        }
      }

      // 内容列
      .item-content {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .item-text {
        font-size: 14px;
        color: #1f2937;
        line-height: 1.4;
      }

      .item-time {
        font-size: 11px;
        color: #9ca3af;
        display: flex;
        align-items: center;
      }

      // 编辑输入
      .edit-input {
        font-size: 14px;
        color: #1f2937;
        border: none;
        border-bottom: 1.5px solid #6d4ef7;
        outline: none;
        background: transparent;
        padding: 1px 0 3px;
        width: 100%;
      }

      // 操作按钮
      .item-actions {
        display: flex;
        gap: 4px;
        opacity: 0;
        transition: opacity 0.15s;
        flex-shrink: 0;
      }

      .action-btn {
        width: 28px;
        height: 28px;
        border: none;
        background: none;
        border-radius: 6px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.12s;
        padding: 0;
      }

      .edit-btn {
        color: #6d4ef7;

        &:hover {
          background: #eef2ff;
        }
      }

      .delete-btn {
        color: #ef4444;

        &:hover {
          background: #fef2f2;
        }
      }
    }
  }
}

// 列表动画
.todo-enter-active,
.todo-leave-active {
  transition: all 0.2s ease;
}

.todo-enter-from {
  opacity: 0;
  transform: translateY(-6px);
}

.todo-leave-to {
  opacity: 0;
  transform: translateX(12px);
}
</style>