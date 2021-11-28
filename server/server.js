const app = require('express')();
const server = require('http').createServer(app);
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require('uuid'); 
const fs = require("fs");
const { spawn } = require("child_process");
const cors = require('cors')


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

app.use(cors())

const io = require('socket.io')(server, {
    cors: {
        origin: "http://localhost:3000",
    }
});
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
    // res.json({test: "ok"})
})
let dataObj = {}
io.on("connection", (socket) => {
    socket.on("code-typed", (data) => {
        io.to(socket.chatroom).emit('code-typed', data)
        dataObj[socket.chatroom] = data;
    })
    socket.on("join-room", (roomId) => {
        socket.join(roomId)
        socket.chatroom = roomId;
        if (dataObj[socket.chatroom]) {
            socket.emit("retrieve-data", dataObj[socket.chatroom])
        }
    })
    socket.on("leave-room", (roomId) => {
        socket.leave(roomId)
        socket.chatroom = "";
    })
});


server.listen(5000, () => console.log("Server started on port 5000"));