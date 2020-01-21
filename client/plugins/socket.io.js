import io from "socket.io-client"
const socket = io(window.location.host)

export default socket
