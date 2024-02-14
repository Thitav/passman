import threading
import modules
import os


def cmd():
  input('> ')
  os._exit(0)


threading.Thread(target=cmd).start()

server = modules.Server()
server.bind('127.0.0.1', 4444)


def create_vault(storage: dict, path: bytes,  key: bytes) -> None:
  decoded_path = path.decode('utf-8')
  decoded_key = key.decode('utf-8')

  loaded_vault = modules.Vault()
  loaded_vault.save(decoded_path, decoded_key)

  storage['loaded_vault'] = loaded_vault
  storage['vault_path'] = decoded_path
  storage['vault_key'] = decoded_key


def load_vault(storage: dict, path: bytes, key: bytes) -> list[bytes]:
  decoded_path = path.decode('utf-8')
  decoded_key = key.decode('utf-8')

  loaded_vault = modules.Vault()
  load = loaded_vault.load(decoded_path, decoded_key)
  if not load:
    return [b'bad password']

  storage['loaded_vault'] = loaded_vault
  storage['vault_path'] = decoded_path
  storage['vault_key'] = decoded_key

  return loaded_vault.export()


def add_password(storage: dict, username: bytes, password: bytes) -> None:
  if 'loaded_vault' not in storage.keys():
    return

  decoded_username = username.decode('utf-8'),
  decoded_password = password.decode('utf-8')

  loaded_vault = storage['loaded_vault']
  loaded_vault.add_password(decoded_username, decoded_password)
  loaded_vault.save(storage['vault_path'], storage['vault_key'])


def rm_password(storage: dict, index: bytes) -> None:
  if 'loaded_vault' not in storage.keys():
    return

  decoded_index = int(index.decode('utf-8'))

  loaded_vault = storage['loaded_vault']
  loaded_vault.rm_password(decoded_index)
  loaded_vault.save(storage['vault_path'], storage['vault_key'])


server.on('create_vault', create_vault)
server.on('load_vault', load_vault)
server.on('add_password', add_password)
server.on('rm_password', rm_password)

server.run()
