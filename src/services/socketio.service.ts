import type { Socket } from "socket.io-client";
import { io } from "socket.io-client";

class SocketIOService {
  socket: Socket;
  constructor() {
    const token = localStorage.getItem('token');
    this.socket = io(import.meta.env.SOCKET_ENDPOINT || "http://localhost:3000", { query: {token: token}, autoConnect: false });
    console.log("SocketIOService: constructor: this.socket:", this.socket);
  }
}

// create an instance/connection here
export const socket = new SocketIOService().socket;