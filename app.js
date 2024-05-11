const express = require("express");
const path = require("path");
const app = express();
const cookieParser = require("cookie-parser");
const expressHbs = require("express-handlebars");
const cors = require("cors");
const createError = require("http-errors");
const morgan = require("morgan");
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const session = require("express-session");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectID;

require("dotenv").config();
app.use(morgan("dev"));

app.use(
  session({
    secret: "mySecretKey",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

//socket start

const users = {};
let TotalPlayer,
  joined = 0;
const color = [];
io.on("connection", (socket) => {
  socket.on("i-am-joining", (name, totalPlayer, callback) => {
    console.log("hello joined");
    users[socket.id] = {
      name: name,
      local_id: joined,
    };
    TotalPlayer = totalPlayer;
    joined++;
    if (TotalPlayer == joined) {
      socket.broadcast.emit("everyone-joined");
      callback({
        every_one: true,
        players: Object.values(users),
        local_id: joined - 1,
      });
    } else {
      socket.broadcast.emit("player-joined", name);
      callback({
        every_one: false,
        players: Object.values(users),
        local_id: joined - 1,
      });
    }
  });

  socket.on("send", (message) => {
    socket.broadcast.emit("receive", {
      message: message,
      name: users[socket.id].name,
    });
  });

  socket.on("dice_clicked", (point) => {
    console.log(users[socket.id])
    socket.broadcast.emit("dice_thrown", {
      point: point,
      local_id : users[socket.id].local_id
    });
  });
  
  socket.on("guti-born", (guti_id) => {
    console.log(users[socket.id],users[socket.id].local_id)
    socket.broadcast.emit("new-guti-born", {
      guti_id: guti_id,
      local_id : users[socket.id].local_id
    });
  });
  
  socket.on("run-guti", (guti_id,point) => {
    socket.broadcast.emit("guti-run", {
      local_id : users[socket.id].local_id,
      guti_id: guti_id,
      point: point,
    });
  });
  
  socket.on("kill-guti", (guti_id,player_id) => {
    socket.broadcast.emit("guti-kill", {
      local_id : player_id,
      guti_id: guti_id,
    });
  });

  socket.on("Change_Player",()=>{
    socket.broadcast.emit("Change_Player")
  })

  // socket.emit("new-player",)
});

//socket end

app.engine(
  "handlebars",
  expressHbs.engine({
    // layoutsDir: "views/layouts/",
    extname: "handlebars",
  })
);

app.set("view engine", "handlebars");
app.use(express.static(path.join(__dirname, "/static/")));

app.use(cookieParser());
app.use("/", require(path.join(__dirname, "routes/index.js")));
app.use("/ludo", require(path.join(__dirname, "routes/ludo.js")));

// app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
  })
);

app.use((err, req, res, next) => {
  // console.log(err);`enter code here`
  res.json({ hi: "hi" });
  // res.sendStatus(500);
});

server.listen(4000, () => {
  console.log("Example app listening on port http://localhost:4000");
});
