import { app, BrowserWindow, Menu, ipcMain } from 'electron'
import { join } from 'path'
import { todoDb } from './db'

// 在 createWindow 之后注册 IPC handlers
function registerIpcHandlers() {
  ipcMain.handle('todo:getAll', () => todoDb.getAll())
  ipcMain.handle('todo:getByDate', (_, dateStr) => todoDb.getByDate(dateStr))
  ipcMain.handle('todo:add', (_, text, dateStr, createdAt) =>
    todoDb.add(text, dateStr, createdAt)
  )
  ipcMain.handle('todo:toggle', (_, id, done) => todoDb.toggle(id, done))
  ipcMain.handle('todo:updateText', (_, id, text) =>
    todoDb.updateText(id, text)
  )
  ipcMain.handle('todo:delete', (_, id) => todoDb.delete(id))
  ipcMain.handle('window-minimize', () => mainWin.minimize())
  ipcMain.handle('window-maximize', () => {
    mainWin.isMaximized() ? mainWin.unmaximize() : mainWin.maximize()
  })
  ipcMain.handle('window-close', () => mainWin.close())
}

function createWindow() {
  const win = new BrowserWindow({
    frame: false,
    width: 900,
    height: 620,
    minWidth: 900,
    minHeight: 620,
    resizable: false,
    icon: join(__dirname, '../../build/icon.ico'),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      sandbox: false,
    },
  })

  if (process.env['ELECTRON_RENDERER_URL']) {
    win.loadURL(process.env['ELECTRON_RENDERER_URL']) // 开发模式加载 Vite
    win.webContents.openDevTools()
  } else {
    win.loadFile(join(__dirname, '../renderer/index.html')) // 生产模式
  }
  return win
}

let mainWin = {}

app.whenReady().then(() => {
  app.commandLine.appendSwitch('high-dpi-support', '1') // 👈 加这行
  app.commandLine.appendSwitch('force-device-scale-factor', '1') // 👈 加这行
  Menu.setApplicationMenu(null)
  mainWin = createWindow()
  registerIpcHandlers()
})
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
