import socket from 'socket.io-client';

export default class Socket {
  constructor(baseURL, getAccessToken) {
    this.io = socket(baseURL, {
      auth: (cb) => cb({ token: getAccessToken() }),
    }); // https://socket.io/docs/v4/middlewares/#sending-credentials

    this.io.on('connect_error', (err) => {
      // console.log('socket error', err.message); // TODO: 로그인 안되었을 경우 소켓 에러 처리
    });
  }

  onSync(event, callback) {
    if (!this.io.connected) {
      this.io.connect();
    }
    this.io.on(event, (message) => callback(message));
    return () => this.io.off(event);
  }
}
