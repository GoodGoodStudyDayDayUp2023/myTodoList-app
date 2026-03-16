import { app, BrowserWindow, Menu } from 'electron'
import { join } from 'path'

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

  win.webContents.openDevTools()

  if (process.env['ELECTRON_RENDERER_URL']) {
    win.loadURL(process.env['ELECTRON_RENDERER_URL']) // 开发模式加载 Vite
  } else {
    win.loadFile(join(__dirname, '../renderer/index.html')) // 生产模式
  }
}

app.whenReady().then(() => {
  app.commandLine.appendSwitch('high-dpi-support', '1') // 👈 加这行
  app.commandLine.appendSwitch('force-device-scale-factor', '1') // 👈 加这行
  Menu.setApplicationMenu(null)
  createWindow()
})
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
