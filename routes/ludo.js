const express = require("express");
const path = require("path");
const router = express.Router();
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectID;

router.get("/", (req, res) => {
  // res.sendFile(path.join(__dirname,'../static/html/ludo.html'))
  res.render("ludostart");
  // res.json({ho: "ko"})
});

router.get("/host", (req, res) => {
  async function main() {
    const uri =
      "mongodb+srv://taufiq2002:TPaZwBbNunY58zp9@playground.tlr8hkg.mongodb.net/?retryWrites=true&w=majority";

    const client = new MongoClient(uri);
    const id = req.cookies.user_id;
    try {
      // Connect to the MongoDB cluster
      await client.connect();
      // Make the appropriate DB calls
      var o_id = new ObjectId(id).valueOf();
      console.log(o_id, userInfo, id, typeof id);
      var userInfo = await client
        .db("playground")
        .collection("tables")
        .findOne({ _id: o_id });
    } catch (e) {
      console.error(e);
    } finally {
      if (userInfo != null) {
        // res.json({ permited: true, key: userInfo.key });
      } else {
        // res.json({ permited: false });
      }
      await client.close();
    }
  }
  // main().catch(console.error);
  res.render("ludo_host");
});

router.get("/host/:num", (req, res) => {
  let code = (10 ** 5 + Math.floor(Math.random() * 10 ** 5)).toString();
  async function main() {
    const uri =
      "mongodb+srv://taufiq2002:TPaZwBbNunY58zp9@playground.tlr8hkg.mongodb.net/?retryWrites=true&w=majority";

    const client = new MongoClient(uri);
    // Connect to the MongoDB cluster
    await client.connect();
    const db = client.db("playground");

    try {
      // Make the appropriate DB calls
      var userInfo = await db.collection("tables").findOne({ code: code });
    } catch (e) {
      console.error(e);
    } finally {
      if (userInfo == null) {
        try {
          // Make the appropriate DB calls
          var key = generatekey();
          console.log(code, "code-key", key);
          userInfo = await db
            .collection("tables")
            .insertOne({ code: code, key: key , tatalPlayer: req.params.num});
        } catch (e) {
          console.error(e);
        } finally {
          res.json({ tablecreated: true, key: key, code: code });
          await client.close();
        }
      } else {
        res.json({ tablecreated: false });
        await client.close();
      }
    }
  }
  main().catch(console.error);
});

router.get("/join/:code", (req, res) => {
  console.log(req.params);
  async function main() {
    const uri =
      "mongodb+srv://taufiq2002:TPaZwBbNunY58zp9@playground.tlr8hkg.mongodb.net/?retryWrites=true&w=majority";

    const client = new MongoClient(uri);

    try {
      // Connect to the MongoDB cluster
      await client.connect();
      const db = client.db("playground");
      // Make the appropriate DB calls
      var userInfo = await db
        .collection("tables")
        .findOne({ code: req.params.code });
    } catch (e) {
      console.error(e);
    } finally {
      if (userInfo != null) {
        res.json({ permited: true, key: userInfo.key });
      } else {
        res.json({ permited: false });
      }
      await client.close();
    }
  }
  main().catch(console.error);
});

router.get("/play/:key", (req, res) => {
  async function main() {
    const uri =
      "mongodb+srv://taufiq2002:TPaZwBbNunY58zp9@playground.tlr8hkg.mongodb.net/?retryWrites=true&w=majority";

    const client = new MongoClient(uri);

    try {
      // Connect to the MongoDB cluster
      await client.connect();
      // Make the appropriate DB calls
      var userInfo = await client
        .db("playground")
        .collection("tables")
        .findOne({ key: req.params.key });
        // console.log(req.params.key)
    } catch (e) {
      console.error(e);
    } finally {
      // console.log(userInfo);
      if (userInfo != null) {
        console.log(userInfo)
        res.render("ludo_table", {
          layout: "ludo",
          showTitle: true,
          home: [ "red","blue", "green", "yellow"],
          road: [23, 24, 25, 22,26,21,27,20,28,19,29,18,30,12,13, 14, 15, 16, 17, 31, 32, 33, 34, 35, 36, 11, 37, 10, 9, 8, 7, 6, 5, 43, 42, 41, 40, 39, 38, 4, 44, 3, 45, 2, 46, 1, 47, 0, 48, 51, 50, 49],
          totalPlayer : userInfo.tatalPlayer,
        });
      }
      await client.close();
    }
  }
  main().catch(console.error);
});

// declare all characters

function generatekey() {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = " ";
  const charactersLength = characters.length;
  for (let i = 0; i < 15; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const { createServer } =require("http");
const { Server }=require("socket.io");
const session =require("express-session");
const { request } = require("http");

const httpServer = createServer();

const sessionMiddleware = session({
  secret: "changeit",
  resave: false,
  saveUninitialized: false
});

const io = new Server(httpServer, {
  allowRequest: (req, callback) => {
    // with HTTP long-polling, we have access to the HTTP response here, but this is not
    // the case with WebSocket, so we provide a dummy response object
    const fakeRes = {
      getHeader() {
        return [];
      },
      setHeader(key, values) {
        req.cookieHolder = values[0];
      },
      writeHead() {},
    };
    sessionMiddleware(req, fakeRes, () => {
      if (req.session) {
        // trigger the setHeader() above
        fakeRes.writeHead();
        // manually save the session (normally triggered by res.end())
        req.session.save();
      }
      callback(null, true);
    });
  },
});

io.engine.on("initial_headers", (headers, req) => {
  if (req.cookieHolder) {
    headers["set-cookie"] = req.cookieHolder;
    delete req.cookieHolder;
  }
});

io.on("connection", (socket) => {
  console.log(socket.request.session,);
});


module.exports = router;
