import zmq


class Server:
  def __init__(self) -> None:
    self.context = zmq.Context()
    self.socket: zmq.Socket = self.context.socket(zmq.PAIR)
    self.storage = {}
    self.routes = {}

  def run(self) -> None:
    while True:
      req = self.recv()
      key = req[0].decode('utf-8')
      req = req[1:]

      if key in self.routes:
        res = self.routes[key](self.storage, *req)
        if res:
          self.send(res)

  def on(self, key: str, handler) -> None:
    self.routes[key] = handler

  def bind(self, addr: str, port: int) -> None:
    self.socket.bind(f'tcp://{addr}:{port}')

  def send(self, data: list[bytes]) -> None:
    self.socket.send_multipart(data)

  def recv(self) -> list[bytes]:
    return self.socket.recv_multipart()
