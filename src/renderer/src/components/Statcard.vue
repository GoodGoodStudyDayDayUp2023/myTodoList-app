<template>
  <div class="stat-card" :style="{ background: bg }">
    <div class="stat-icon" :style="{ color: iconColor }">
      <component :is="iconComponent" />
    </div>
    <div class="stat-label">{{ label }}</div>
    <div class="stat-value" :style="{ color: valueColor }">{{ value }}</div>
  </div>
</template>

<script setup>
import { computed } from "vue"

// icon 组件用 SVG inline，避免图标库依赖
const ICONS = {
  pending: {
    render() {
      return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2, width: 22, height: 22 },
        [h('circle', { cx: 12, cy: 12, r: 10 })]
      )
    }
  },
  done: {
    render() {
      return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2, width: 22, height: 22 },
        [h('path', { d: 'M22 11.08V12a10 10 0 1 1-5.93-9.14' }),
        h('polyline', { points: '22 4 12 14.01 9 11.01' })]
      )
    }
  },
  rate: {
    render() {
      return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2, width: 22, height: 22 },
        [h('polyline', { points: '23 6 13.5 15.5 8.5 10.5 1 18' }),
        h('polyline', { points: '17 6 23 6 23 12' })]
      )
    }
  },
  week: {
    render() {
      return h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2, width: 22, height: 22 },
        [h('rect', { x: 3, y: 4, width: 18, height: 18, rx: 2, ry: 2 }),
        h('line', { x1: 16, y1: 2, x2: 16, y2: 6 }),
        h('line', { x1: 8, y1: 2, x2: 8, y2: 6 }),
        h('line', { x1: 3, y1: 10, x2: 21, y2: 10 })]
      )
    }
  }
}

import { h } from "vue"

const props = defineProps({
  type: { type: String, default: 'pending' }, // pending | done | rate | week
  label: { type: String, required: true },
  value: { type: [String, Number], required: true },
})

const themeMap = {
  pending: { bg: '#eef2ff', iconColor: '#6366f1', valueColor: '#111827' },
  done: { bg: '#f0fdf4', iconColor: '#22c55e', valueColor: '#111827' },
  rate: { bg: '#f5f3ff', iconColor: '#8b5cf6', valueColor: '#111827' },
  week: { bg: '#fff7ed', iconColor: '#f97316', valueColor: '#111827' },
}

const theme = computed(() => themeMap[props.type] ?? themeMap.pending)
const bg = computed(() => theme.value.bg)
const iconColor = computed(() => theme.value.iconColor)
const valueColor = computed(() => theme.value.valueColor)
const iconComponent = computed(() => ICONS[props.type] ?? ICONS.pending)
</script>

<style lang="scss" scoped>
.stat-card {
  border-radius: 16px;
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  min-width: 0;

  .stat-icon {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .stat-label {
    font-size: 13px;
    color: #6b7280;
    margin-top: 4px;
  }

  .stat-value {
    font-size: 32px;
    font-weight: 700;
    line-height: 1;
  }
}
</style>