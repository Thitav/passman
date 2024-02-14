from Crypto.Random import get_random_bytes
from Crypto.Protocol.KDF import PBKDF2
from Crypto.Hash import SHA256, SHA512
from Crypto.Cipher import AES


def generate_salt(length: int) -> bytes:
  return get_random_bytes(length)


def derive_key(key: str, salt: bytes) -> bytes:
  dkey = PBKDF2(key, salt, count=10**6, hmac_hash_module=SHA512)
  return dkey


class AESCipher:
  def __init__(self, key: bytes) -> None:
    self.bs = AES.block_size
    self.key = SHA256.new(key).digest()

  def encrypt(self, data: bytes) -> bytes:
    data = self._pad(data)
    iv = get_random_bytes(AES.block_size)
    cipher = AES.new(self.key, AES.MODE_CBC, iv)
    return iv + cipher.encrypt(data)

  def decrypt(self, data: bytes) -> bytes:
    iv = data[:AES.block_size]
    cipher = AES.new(self.key, AES.MODE_CBC, iv)
    return self._unpad(cipher.decrypt(data[AES.block_size:]))

  def _pad(self, data: bytes) -> bytes:
    s = (self.bs - len(data) % self.bs)
    return data + (s * s.to_bytes(1, 'big'))

  @staticmethod
  def _unpad(data: bytes) -> bytes:
    return data[:-ord(data[len(data)-1:])]
