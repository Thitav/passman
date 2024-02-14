from . import crypto
import pickle


class Vault:
  def __init__(self, passwords: list[tuple[str, str]] = []) -> None:
    self.passwords: list[tuple[str, str]] = passwords

  def add_password(self, username: str, password: str) -> None:
    self.passwords.append((username, password))

  def rm_password(self, index: int) -> None:
    self.passwords.pop(index)

  def load(self, path: str, key: str) -> bool:
    with open(path, 'rb') as file:
      data = file.read()
      file.close()

    salt = data[:16]
    stored_dkey = data[:32][16:]
    data = data[32:]

    dkey = crypto.derive_key(key, salt)

    if stored_dkey != dkey:
      return False

    cipher = crypto.AESCipher(dkey)
    data = cipher.decrypt(data)
    if data:
      self.passwords = pickle.loads(data)

    return True

  def save(self, path: str, key: str) -> None:
    data = pickle.dumps(self.passwords)
    salt = crypto.generate_salt(16)
    dkey = crypto.derive_key(key, salt)
    cipher = crypto.AESCipher(dkey)

    data = cipher.encrypt(data)
    data = salt + dkey + data

    with open(path, 'wb') as file:
      file.write(data)
      file.close()

  def export(self) -> list[bytes]:
    if self.passwords:
      return [i[0].encode() + b':' + i[1].encode() for i in self.passwords]
    return [b'empty']
