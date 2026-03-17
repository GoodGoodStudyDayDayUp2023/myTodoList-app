<template>
  <div class="calendar-view">
    <!-- 左：日历 -->
    <div class="calendar-card">
      <div class="cal-header">
        <button class="nav-btn" @click="prevMonth">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <span class="month-label">{{ monthLabel }}</span>
        <button class="nav-btn" @click="nextMonth">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      <div class="weekdays">
        <span v-for="d in weekdays" :key="d">{{ d }}</span>
      </div>

      <div class="days-grid">
        <span v-for="cell in calendarCells" :key="cell.key" :class="[
          'day-cell',
          { 'other-month': !cell.inMonth },
          { 'today': cell.isToday },
          { 'selected': cell.dateStr === selectedDate },
          { 'has-todo': cell.inMonth && activeDates.has(cell.dateStr) },
        ]" @click="cell.inMonth && selectDate(cell.dateStr)">
          {{ cell.day }}
        </span>
      </div>
    </div>

    <!-- 右：选中日期的待办 -->
    <div class="todos-panel">
      <!-- 日期标题 -->
      <div class="panel-header">
        <div>
          <h2 class="panel-date">{{ selectedDateLabel }}</h2>
          <p class="panel-count">{{ dayTodos.length }} 个备忘录</p>
        </div>
      </div>

      <!-- 待完成分组 -->
      <div class="panel-body">
        <EmptyState v-if="dayTodos.length === 0" type="calendar" title="这一天还没有待办事项" />

        <template v-else>
          <div v-if="pendingTodos.length > 0" class="todo-group">
            <p class="section-label">
              <span class="dot pending-dot"></span>
              待办事项 ({{ pendingTodos.length }})
            </p>
            <TransitionGroup name="todo" tag="div" class="todo-items">
              <div v-for="item in pendingTodos" :key="item.id" class="todo-item">
                <button :class="['checkbox', { checked: item.done }]" @click="toggleTodo(item)">
                  <svg v-if="item.done" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
                    width="11" height="11">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </button>
                <div class="item-content">
                  <input v-if="item.editing" class="edit-input" v-model="item.editText"
                    @keydown.enter="confirmEdit(item)" @keydown.escape="item.editing = false" @blur="confirmEdit(item)"
                    v-focus />
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
                  <button class="action-btn edit-btn" @click="startEdit(item)">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </button>
                  <button class="action-btn delete-btn" @click="deleteTodo(item.id)">
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

          <div v-if="doneTodos.length > 0" class="todo-group">
            <p class="section-label">
              <span class="dot done-dot"></span>
              已完成 ({{ doneTodos.length }})
            </p>
            <TransitionGroup name="todo" tag="div" class="todo-items">
              <div v-for="item in doneTodos" :key="item.id" class="todo-item done">
                <button :class="['checkbox', { checked: true }]" @click="toggleTodo(item)">
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
                  <button class="action-btn delete-btn" @click="deleteTodo(item.id)">
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
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue"
import { toDateStr, formatTime, normalizeRow } from "@/utils/tool"
import EmptyState from "@/components/EmptyState.vue"

const vFocus = { mounted: (el) => el.focus() }

// ── 日历逻辑 ─────────────────────────────────────────
const weekdays = ["日", "一", "二", "三", "四", "五", "六"]
const viewYear = ref(new Date().getFullYear())
const viewMonth = ref(new Date().getMonth())

const monthLabel = computed(() =>
  `${viewYear.value}年${viewMonth.value + 1}月`
)

const prevMonth = () => {
  if (viewMonth.value === 0) { viewYear.value--; viewMonth.value = 11 }
  else viewMonth.value--
}
const nextMonth = () => {
  if (viewMonth.value === 11) { viewYear.value++; viewMonth.value = 0 }
  else viewMonth.value++
}

const calendarCells = computed(() => {
  const year = viewYear.value
  const month = viewMonth.value
  const firstDay = new Date(year, month, 1).getDay()
  const daysCount = new Date(year, month + 1, 0).getDate()
  const prevDays = new Date(year, month, 0).getDate()
  const today = toDateStr()
  const cells = []

  for (let i = firstDay - 1; i >= 0; i--) {
    const d = new Date(year, month - 1, prevDays - i)
    cells.push({ key: `p${i}`, day: prevDays - i, inMonth: false, isToday: false, dateStr: toDateStr(d) })
  }
  for (let d = 1; d <= daysCount; d++) {
    const dateStr = toDateStr(new Date(year, month, d))
    cells.push({ key: dateStr, day: d, inMonth: true, isToday: dateStr === today, dateStr })
  }
  const remaining = 42 - cells.length
  for (let d = 1; d <= remaining; d++) {
    const dateStr = toDateStr(new Date(year, month + 1, d))
    cells.push({ key: `n${d}`, day: d, inMonth: false, isToday: false, dateStr })
  }
  return cells
})

// ── 选中日期 ─────────────────────────────────────────
const dayTodos = computed(() => todoList.value)
const selectedDate = ref(toDateStr())

const selectedDateLabel = computed(() => {
  const [y, m, d] = selectedDate.value.split("-").map(Number)
  return new Date(y, m - 1, d).toLocaleDateString("zh-CN", {
    month: "long", day: "numeric", weekday: "long"
  })
})

const selectDate = async (dateStr) => {
  selectedDate.value = dateStr
  await getData(dateStr)
}

// ── 待办数据 ─────────────────────────────────────────
const todoList = ref([])
const pendingTodos = computed(() => todoList.value.filter(i => !i.done))
const doneTodos = computed(() => todoList.value.filter(i => i.done))

// 有待办的日期集合（用于日历打点）
const activeDates = ref(new Set())

const getData = async (dateStr = selectedDate.value) => {
  const rows = await window.electronAPI.getByDate(dateStr)
  todoList.value = rows.map(normalizeRow)
}

// 加载当月所有有待办的日期（用于打点）
const loadActiveDates = async () => {
  const rows = await window.electronAPI.getAll()
  activeDates.value = new Set(rows.map(r => r.date_str))
}

// 切换月份时刷新打点
watch([viewYear, viewMonth], loadActiveDates)

onMounted(async () => {
  await getData()
  await loadActiveDates()
})

// ── 增删改 ───────────────────────────────────────────
const toggleTodo = async (item) => {
  const success = await window.electronAPI.toggle(item.id, !item.done)
  if (success) item.done = !item.done
}

const deleteTodo = async (id) => {
  const success = await window.electronAPI.delete(id)
  if (success) {
    todoList.value = todoList.value.filter(i => i.id !== id)
    await loadActiveDates()
  }
}

const startEdit = (item) => {
  item.editText = item.text
  item.editing = true
}
const confirmEdit = async (item) => {
  const text = item.editText?.trim()
  if (text) {
    const success = await window.electronAPI.updateText(item.id, text)
    if (success) item.text = text
  }
  item.editing = false
}

</script>

<style lang="scss" scoped>
.calendar-view {
  padding: 20px 24px;
  display: flex;
  gap: 20px;
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;

  // ── 左侧日历 ────────────────────────────────────
  .calendar-card {
    width: 290px;
    flex-shrink: 0;
    background: #fff;
    border-radius: 16px;
    padding: 20px;
    align-self: flex-start; // 不拉伸，内容多高就多高

    .cal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 14px;

      .nav-btn {
        width: 26px;
        height: 26px;
        border: none;
        background: none;
        cursor: pointer;
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #6b7280;
        transition: background 0.15s;

        &:hover {
          background: #f3f4f6;
        }
      }

      .month-label {
        font-size: 13px;
        font-weight: 600;
        color: #111827;
      }
    }

    .weekdays {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      margin-bottom: 6px;

      span {
        text-align: center;
        font-size: 11px;
        font-weight: 600;
        color: #9ca3af;
        padding: 3px 0;
      }
    }

    .days-grid {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 1px;

      .day-cell {
        aspect-ratio: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        color: #374151;
        border-radius: 50%;
        cursor: pointer;
        position: relative;
        transition: background 0.12s;

        &.other-month {
          color: #d1d5db;
          cursor: default;
        }

        &:not(.other-month):not(.today):not(.selected):hover {
          background: #f3f4f6;
        }

        &.today {
          background: #eef2ff;
          color: #6d4ef7;
          font-weight: 700;
        }

        &.selected {
          background: #1f2937;
          color: #fff;
          font-weight: 700;
        }

        // 有待办打点
        &.has-todo::after {
          content: '';
          position: absolute;
          bottom: 2px;
          width: 4px;
          height: 4px;
          background: #6d4ef7;
          border-radius: 50%;
        }

        &.today.has-todo::after {
          background: #fff;
        }
      }
    }
  }

  // ── 右侧待办面板 ─────────────────────────────────
  .todos-panel {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 14px;
    overflow: hidden;

    .panel-header {
      background: #fff;
      border-radius: 16px;
      padding: 16px 20px;
      flex-shrink: 0;

      .panel-date {
        font-size: 18px;
        font-weight: 700;
        color: #111827;
        margin: 0 0 4px;
      }

      .panel-count {
        font-size: 13px;
        color: #9ca3af;
        margin: 0;
      }
    }

    .panel-body {
      flex: 1;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 14px;

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
    }

    // 分组
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

    // ── 单条 ────────────────────────────────────────
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