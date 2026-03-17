import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  getAll: () => ipcRenderer.invoke('todo:getAll'),
  getByDate: (dateStr) => ipcRenderer.invoke('todo:getByDate', dateStr),
  add: (text, dateStr, createdAt) =>
    ipcRenderer.invoke('todo:add', text, dateStr, createdAt),
  toggle: (id, done) => ipcRenderer.invoke('todo:toggle', id, done),
  updateText: (id, text) => ipcRenderer.invoke('todo:updateText', id, text),
  delete: (id) => ipcRenderer.invoke('todo:delete', id),
  minimize: () => ipcRenderer.invoke('window-minimize'),
  maximize: () => ipcRenderer.invoke('window-maximize'),
  close: () => ipcRenderer.invoke('window-close'),
})
