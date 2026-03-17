<template>
  <div class="empty-state">
    <div class="empty-icon">
      <!-- 文件图标 / 日历图标 -->
      <svg v-if="type === 'file'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="52"
        height="52">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
      </svg>
      <svg v-else-if="type === 'calendar'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
        width="52" height="52">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
        <line x1="8" y1="14" x2="8.01" y2="14" />
        <line x1="12" y1="14" x2="12.01" y2="14" />
        <line x1="16" y1="14" x2="16.01" y2="14" />
        <line x1="8" y1="18" x2="8.01" y2="18" />
        <line x1="12" y1="18" x2="12.01" y2="18" />
      </svg>
    </div>
    <p class="empty-title">{{ title }}</p>
    <p v-if="subtitle" class="empty-subtitle">{{ subtitle }}</p>
  </div>
</template>

<script setup>
defineProps({
  type: { type: String, default: 'file' },    // file | calendar
  title: { type: String, default: '暂无数据' },
  subtitle: { type: String, default: '' },
})
</script>

<style lang="scss" scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 0;
  gap: 10px;

  .empty-icon {
    color: #d1d5db;
    margin-bottom: 4px;
  }

  .empty-title {
    font-size: 15px;
    color: #9ca3af;
    font-weight: 500;
    margin: 0;
  }

  .empty-subtitle {
    font-size: 13px;
    color: #c4c9d4;
    margin: 0;
  }
}
</style>