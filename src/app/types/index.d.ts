declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    ipc: {
      send: (channel: string, ...args: any[]) => void
      on: (
        channel: string,
        // eslint-disable-next-line no-undef
        listener: (event: Electron.IpcRendererEvent, ...args: any[]) => any
      ) => void
      invoke: (channel: string, ...args: any[]) => Promise<any>
    }
    electron: {
      // eslint-disable-next-line no-undef
      dialog: Electron.Dialog
    }
  }
}

export {}
