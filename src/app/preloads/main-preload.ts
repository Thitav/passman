import { contextBridge, ipcRenderer, dialog } from 'electron'

const ipcChannels = {
  send: [''],
  on: [''],
  invoke: ['createVault', 'loadVault', 'addPassword', 'rmPassword']
}

contextBridge.exposeInMainWorld('ipc', {
  send: (channel: string, ...args: any[]) => {
    if (ipcChannels.send.includes(channel)) {
      ipcRenderer.send(channel, args)
    }
  },
  on: (
    channel: string,
    // eslint-disable-next-line no-undef
    listener: (event: Electron.IpcRendererEvent, ...args: any[]) => any
  ) => {
    if (ipcChannels.on.includes(channel)) {
      ipcRenderer.on(channel, listener)
    }
  },
  invoke: (channel: string, ...args: any[]) => {
    if (ipcChannels.invoke.includes(channel)) {
      return ipcRenderer.invoke(channel, ...args)
    }
  }
})

contextBridge.exposeInMainWorld('electron', {
  dialog
})
