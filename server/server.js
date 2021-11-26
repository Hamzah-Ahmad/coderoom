const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: "http://localhost:3000",
    }
});
io.on("connection", (socket) => {
    let dataObj = {}
    socket.on("code-typed", (data) => {
        io.to(socket.chatroom).emit('code-typed', data)
    })
    socket.on("join-room", (roomId) => {
        socket.join(roomId)
        socket.chatroom = roomId;
    })
    socket.on("leave-room", (roomId) => {
        socket.leave(roomId)
        socket.chatroom = "";
    })
});
server.listen(5000, () => console.log("Server started on port 5000"));