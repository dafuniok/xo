/**
 * Creates games events on the given SocketIO.Server.
 * @param {SocketIO.Server} io
 */
exports.create = function(io) {
  const users = {}
  const messages = []

  io.on("connection", socket => {
    // create user
    users[socket.id] = {
      id: socket.id,
      idShort: `${socket.id.slice(0, 4)}..`,
      ready: false,
      grid: "",
      name: ""
    }
    const usersCount = Object.keys(users).length
    socket.broadcast.emit("user-count", {
      usersCount: usersCount
    })
    socket.emit("user-count", { usersCount: usersCount })
    console.log(`User`, [socket.id], `connected (Users online: ${usersCount})`)

    // ready check
    socket.on("ready-check", grid => {
      users[socket.id].ready = true
      users[socket.id].grid = grid
      // opponent search
      for (const user in users) {
        // not oneself, ready and same grid
        if (
          socket.id !== user &&
          users[user].ready &&
          users[user].grid === users[socket.id].grid
        ) {
          // reset ready state
          users[socket.id].ready = false
          users[user].ready = false
          // create and join new room
          const newRoomId = Math.random()
            .toString(36)
            .substring(3)
          io.sockets.sockets[socket.id].join(newRoomId)
          io.sockets.sockets[user].join(newRoomId)
          // start game
          io.to(newRoomId).emit("game-start", {
            users: [socket.id, user],
            room: newRoomId
          })
          // with random turn
          const randomUserId = [socket.id, users[user].id][
            Math.floor(Math.random() * 2)
          ]
          io.to(randomUserId).emit("game-turn")
          console.log(
            "Room",
            `[ \x1b[36m'${newRoomId}'\x1b[0m ] Game Start with`,
            [socket.id, user]
          )
          console.log(
            "Room",
            `[ \x1b[36m'${newRoomId}'\x1b[0m ] User`,
            [randomUserId],
            "turn"
          )
          break
        }
      }
    })

    // game end
    socket.on("game-end", room => {
      users[socket.id].ready = false
      io.of("/")
        .in(room)
        .clients((error, clients) => {
          if (error) throw error
          if (clients.length > 0) {
            // remove users from room
            clients.forEach(user => {
              io.sockets.sockets[user].leave(room)
              // console.log('User', [user], `left Room [ \x1b[36m\'${room}\'\x1b[0m ]`)
            })
            console.log("Room", `[ \x1b[36m'${room}'\x1b[0m ] Game End`)
          }
        })
    })

    // user disconnect
    socket.on("disconnect", () => {
      socket.broadcast.emit("user-count", {
        usersCount: Object.keys(users).length
      })
      console.log(
        `User`,
        [socket.id],
        `disconnect (Users online: ${Object.keys(users).length})`
      )
    })

    // while disconnecting remove user and notify rooms
    socket.on("disconnecting", () => {
      delete users[socket.id]
      const rooms = Object.keys(socket.rooms)
      if (rooms.length >= 2) {
        socket.to(rooms[1]).emit("user-left")
        io.of("/")
          .in(rooms[1])
          .clients((error, clients) => {
            if (error) throw error
            clients.forEach(userId => {
              if (userId !== socket.id) {
                users[userId].ready = false
              }
            })
          })
      }
    })

    // sync turn
    socket.on("game-turn", data => {
      io.to(data.opponentId).emit("game-turn")
      console.log(
        "Room",
        `[ \x1b[36m'${data.roomId}'\x1b[0m ] User`,
        [data.opponentId],
        "turn"
      )
    })

    // sync score
    socket.on("score", data => {
      console.log(
        "Room",
        `[ \x1b[36m'${data.roomId}'\x1b[0m ] User`,
        [socket.id],
        "scored"
      )
      io.to(data.opponentId).emit("opponent-score")
    })

    // sync active edge
    socket.on("edge-activate", data => {
      // console.log('User', [socket.id], `activated Edge ${data.edgeId}`)
      io.to(data.opponentId).emit("opponent-edge-activate", data.edgeId)
    })

    // chat
    socket.on("last-messages", fn => {
      console.log("User %s - last-messages", socket.id)
      fn(messages.slice(-50))
    })

    socket.on("send-message", message => {
      console.log(`User ${socket.id} - send-message `, message)
      messages.push(message)
      socket.broadcast.emit("new-message", message)
    })
  })
}
