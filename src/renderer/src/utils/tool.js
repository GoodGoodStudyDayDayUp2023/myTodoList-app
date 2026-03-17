export const toDateStr = (d = new Date()) => {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export const formatTime = (ts) => {
  const d = new Date(ts)
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}  ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

export const normalizeRow = (row) => ({
  id: row.id,
  text: row.text,
  done: row.done === 1,
  dateStr: row.date_str,
  createdAt: row.created_at,
  editing: false,
  editText: '',
})
