import io from "socket.io-client"
const socket = io(window.location.host, {
  transports: ["websocket"]
})

export default socket
