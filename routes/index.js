const express = require("express");
const path = require("path");
const router = express.Router();
const { MongoClient } = require("mongodb");

router.get("/", (req, res) => {
  res.render('home');
});

router.get("/signup", (req, res) => {
  res.render('signup');
});

router.get("/signin", (req, res) => {
  res.render('signin');
});

router.get("/register/:name&:email&:password", (req, res) => {
  // console.log(req.params);
  async function main() {
    const uri =
      "mongodb+srv://taufiq2002:TPaZwBbNunY58zp9@playground.tlr8hkg.mongodb.net/?retryWrites=true&w=majority";

    const client = new MongoClient(uri);

    try {
      // Connect to the MongoDB cluster
      await client.connect();
      const db = client.db("playground");
      // Make the appropriate DB calls
      await db.collection("players").insertOne(req.params);
    } catch (e) {
      console.error(e);
    } finally {
      res.json("ok");
      await client.close();
    }
  }
  main().catch(console.error);
});

router.get("/authenticate/:email&:password", (req, res) => {
  async function main() {
    const uri =
      "mongodb+srv://taufiq2002:TPaZwBbNunY58zp9@playground.tlr8hkg.mongodb.net/?retryWrites=true&w=majority";

    const client = new MongoClient(uri);
    // let userInfo
    try {
      // Connect to the MongoDB cluster
      await client.connect();
      const db = client.db("playground");

      // Make the appropriate DB calls
      var userInfo = await db
        .collection("players")
        .findOne({ email: req.params.email });
    } catch (e) {
      console.error(e);
    } finally {
      if (userInfo == null) {
        res.json({ authenticated: false, error: "Email" });
      }
      if (userInfo.password == req.params.password) {
        res.json({ authenticated: true, userid: userInfo._id, name: userInfo.name});
      } else {
        res.json({ authenticated: false, error: "Password" });
      }
      await client.close();
    }
  }
  main().catch(console.error);
});

module.exports = router;
