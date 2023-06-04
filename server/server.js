const app = require("express")();
const server = require("http").createServer(app);
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const { spawn } = require("child_process");
const cors = require("cors");
const { default: axios } = require("axios");
require("dotenv").config();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// prevent CORS error
app.use(cors());

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

// route to wake Heroku dyno
app.get("/", (req, res) => {
  console.log(process.env.JDOODLE_CLIEN_ID);
  console.log(process.env.JDOODLE_CLIENT_SECRET);
  res.status(200).json({ message: "Server awake" });
});
// route to execute code on the server.
app.post("/execute", async (req, res) => {
  const credsUsed = await axios.post(
    "https://api.jdoodle.com/v1/credit-spent",
    {
      clientId: process.env.JDOODLE_CLIEN_ID,
      clientSecret: process.env.JDOODLE_CLIENT_SECRET,
    }
  );
  if (credsUsed?.data?.used > 195) {
    result = {
      type: "error",
      data: "API tokens have expired for the day. Please try again later",
    };
    return res.json(result);
  }
  const { code, language_code } = req.body;

  const program = {
    script: code,
    language: language_code,
    versionIndex: "3",
    clientId: process.env.JDOODLE_CLIEN_ID,
    clientSecret: process.env.JDOODLE_CLIENT_SECRET,
  };

  try {
    let resp = await axios.post("https://api.jdoodle.com/v1/execute", program);
    if (resp?.data?.error) {
      return res.json({ type: "error", data: resp?.data?.error });
    } else {
      return res.json({ type: "success", data: resp?.data?.output });
    }
  } catch (err) {
    console.log(err);
    return res.json({ type: "error", data: "Error occured on the serer" });
  }

});

let dataObj = {}; //dataObj will be used to provide all the current code in the room to new participants
io.on("connection", (socket) => {
  socket.on("code-typed", (data) => {
    socket.to(socket.chatroom).emit("code-typed", data);
    dataObj[socket.chatroom] = data;
  });
  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    socket.chatroom = roomId;
    //retrieve existing room code for new room participants
    if (dataObj[socket.chatroom]) {
      socket.emit("retrieve-data", dataObj[socket.chatroom]);
    }
  });
  socket.on("leave-room", (roomId) => {
    socket.leave(roomId);
    socket.chatroom = "";
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
