const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
require("./db/conn");
const userModel = require("./model/user.model");

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:5173", "*"],
  methods: ["GET", "POST"],
  credentials: true
}))

app.use(express.json());
dotenv.config({ path: "config.env" });

// defining port
const PORT = process.env.PORT || 3000;
app.use(require("./router/addUser"));
app.use(require("./router/getUser"));
app.use(require("./router/updateUser"));

// setting up an empty GET Route
app.get('/', (req, res) => { res.json({ message: "You've come to the right place... it's a GET request!!" }) });

// Starting Server on PORT
app.listen(PORT, () => console.log('Server started on PORT Number: ' + PORT))