const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: "http://localhost:3000",
    }
});
io.on("connection", (socket) => {
    console.log("connected")
    socket.on("code-typed", (data) => {
        console.log(data)
        io.emit('code-typed', data)
    })
    // socket.on("joinRoom", ({ user, room }) => {
    //   socket.join(room.toLowerCase());
    //   socket.username = user.name; //We gave the sockets a username property so that we could use it to identify which user just disconnected
    //   socket.chatroom = room.toLowerCase();
    //   socket.broadcast
    //     .to(socket.chatroom)
    //     .emit("welcomeUser", `${user.name} has joined the room`);
    // });
    // socket.on("disconnect", () => {
    //   socket.broadcast
    //     .to(socket.chatroom)
    //     .emit("welcomeUser", `${socket.username} has disconnected.`);
    //   socket.leave(socket.chatroom);
    // });
});
server.listen(5000, () => console.log("Server started on port 5000"));