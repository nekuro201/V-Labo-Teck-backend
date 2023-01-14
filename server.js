// server.js
const express = require("express");
const app = express();
require("dotenv/config");
const cors = require("cors");

const mongoose = require("mongoose");

const UserRoute = require('./src/routes/UserRoute')
const ExerciceRoute = require('./src/routes/ExericicesRoute')

mongoose.set("strictQuery", false);

function tryReconnect() {
  mongoose.connect("mongodb://localhost/vlaboapi", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  mongoose.connection.on("disconnected", () => {
    console.error("MongoDB disconnected, trying to reconnect...");
    setTimeout(tryReconnect, 5000);
  });

  mongoose.connection.on("connected", () => {
    console.log("MongoDB connected");
  });

  mongoose.connection.on("error", (err) => {
    console.error("MongoDB connection error: ", err);
  });
}

tryReconnect();

app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: "GET,POST,PUT,DELETE,OPTIONS",
  })
);
app.use(express.json());

app.use('/user', UserRoute);
app.use('/exercice', ExerciceRoute);

app.listen("5152", () => console.log("Server running on port 5152"));