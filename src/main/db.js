import Database from 'better-sqlite3'
import { app } from 'electron'
import path from 'path'
import fs from 'fs'

// 数据库存在用户数据目录，不会因重新打包丢失
const dbDir = app.getPath('userData')
const dbPath = path.join(dbDir, 'todos.db')

const db = new Database(dbPath)

// 开启 WAL 模式，性能更好
db.pragma('journal_mode = WAL')

// 建表（首次运行自动创建）
db.exec(`
  CREATE TABLE IF NOT EXISTS todos (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    text        TEXT    NOT NULL CHECK(length(trim(text)) > 0),  -- 不能是空字符串
    done        INTEGER NOT NULL DEFAULT 0 CHECK(done IN (0, 1)),-- 只能是 0 或 1
    date_str    TEXT    NOT NULL CHECK(date_str GLOB '????-??-??'), -- 必须是 yyyy-MM-dd 格式
    created_at  INTEGER NOT NULL CHECK(created_at > 0)           -- 必须是正整数时间戳
  )
`)

// ── CRUD 操作 ────────────────────────────────────────────────
export const todoDb = {
  getAll() {
    return db.prepare('SELECT * FROM todos ORDER BY created_at DESC').all()
  },

  getByDate(dateStr) {
    return db
      .prepare(
        'SELECT * FROM todos WHERE date_str = ? ORDER BY created_at DESC'
      )
      .all(dateStr)
  },

  // db.js 的 add 方法加入参数校验
  add(text, dateStr, createdAt) {
    if (!text?.trim()) throw new Error('text 不能为空')
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr))
      throw new Error('dateStr 格式错误')
    if (!Number.isInteger(createdAt) || createdAt <= 0)
      throw new Error('createdAt 非法')

    const stmt = db.prepare(
      'INSERT INTO todos (text, done, date_str, created_at) VALUES (?, 0, ?, ?)'
    )
    const result = stmt.run(text.trim(), dateStr, createdAt)
    return {
      id: result.lastInsertRowid,
      text: text.trim(),
      done: 0,
      date_str: dateStr,
      created_at: createdAt,
    }
  },

  toggle(id, done) {
    const result = db
      .prepare('UPDATE todos SET done = ? WHERE id = ?')
      .run(done ? 1 : 0, id)
    return result.changes > 0 // true 表示修改成功，false 表示 id 不存在
  },

  updateText(id, text) {
    db.prepare('UPDATE todos SET text = ? WHERE id = ?').run(text, id)
  },

  delete(id) {
    const result = db.prepare('DELETE FROM todos WHERE id = ?').run(id)
    return result.changes > 0
  },
}
