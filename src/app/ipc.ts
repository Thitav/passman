import { app, ipcMain } from 'electron'
import * as zmq from 'zeromq'
import * as path from 'path'

const client = new zmq.Pair()
client.connect('tcp://127.0.0.1:4444')

ipcMain.handle('createVault', async (event, name: string, key: string) => {
  await client.send([
    'create_vault',
    path.join(app.getAppPath(), `${name}.vault`),
    key
  ])
})

ipcMain.handle('loadVault', async (event, path: string, key: string) => {
  await client.send(['load_vault', path, key])
  const res: Buffer[] = await client.receive()

  const decoded: string[] = []
  res.forEach(item => {
    decoded.push(item.toString())
  })

  return decoded
})

ipcMain.handle(
  'addPassword',
  async (event, username: string, password: string) => {
    return await client.send(['add_password', username, password])
  }
)
