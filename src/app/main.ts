import { app, BrowserWindow } from 'electron'
// import * as childProcess from 'child_process'
import * as path from 'path'
import './ipc'

function createWindow() {
  const mainWindow = new BrowserWindow({
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preloads/main-preload.js')
    },
    width: 800
  })

  mainWindow.loadFile(path.join(__dirname, '../public/index.html'))
  mainWindow.webContents.openDevTools()
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// let pyProc: childProcess.ChildProcessWithoutNullStreams = null

// const createPyProc = () => {
//   const script = path.join(__dirname, '../backend/api.py')
//   pyProc = childProcess.spawn('python', [script, '5555'])
// }

// const exitPyProc = () => {
//   pyProc.kill()
//   pyProc = null
// }

// app.on('ready', createPyProc)
// app.on('will-quit', exitPyProc)
