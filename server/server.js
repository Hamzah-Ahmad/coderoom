const app = require('express')();
const server = require('http').createServer(app);
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require('uuid'); 
const fs = require("fs");
const { spawn } = require("child_process");
const cors = require('cors')
require('dotenv').config()


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

// prevent CORS error 
app.use(cors())

const io = require('socket.io')(server, {
    cors: {
        origin: "*"
    }
});

// route to wake Heroku dyno 
app.get("/", (req, res) => {
    res.status(200).json({message: "Server awake"})
})
// route to execute code on the server.
app.post("/execute", (req, res) => {
    const { code } = req.body;
    let result;
    let fileName = uuidv4() + ".js";
    try {
        fs.writeFileSync(fileName, code);
        // spawn a new child process
        const javaScript = spawn("node", [fileName]);
        javaScript.stdout.on('data', function (data) {
            result = { type: "success", data: data.toString() };
        });
        javaScript.stderr.on("data", function (data) {
            result = { type: "error", data: data.toString() };
        })
        javaScript.on('close', (code) => {
            if(fileName) fs.unlinkSync(fileName);
            res.json(result);
        });
    } catch (e) {
        fs.unlinkSync(fileName)
        console.log(`Exception occurred!!!`);
    }
})


let dataObj = {} //dataObj will be used to provide all the current code in the room to new participants
io.on("connection", (socket) => {
    socket.on("code-typed", (data) => {
        io.to(socket.chatroom).emit('code-typed', data)
        dataObj[socket.chatroom] = data;
    })
    socket.on("join-room", (roomId) => {
        socket.join(roomId)
        socket.chatroom = roomId;
        //retrieve existing room code for new room participants
        if (dataObj[socket.chatroom]) {
            socket.emit("retrieve-data", dataObj[socket.chatroom])
        }
    })
    socket.on("leave-room", (roomId) => {
        socket.leave(roomId)
        socket.chatroom = "";
    })
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server started on port ${PORT}`));