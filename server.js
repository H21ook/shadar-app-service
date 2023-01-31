const express = require("express");
const mongoose = require("mongoose");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const fs = require('fs');

require("dotenv").config();
const app = express();
app.use(fileUpload());
app.use(cors());
app.use(express.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
app.use(express.json());

// Database connection
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const con = mongoose.connection;

con.on("open", () => {
  console.log("connected DB");
});

// Router
const newsRouter = require("./src/routers/NewsRouter");
app.use("/news", newsRouter);

const branchRouter = require("./src/routers/BranchRouter");
app.use("/branch", branchRouter);

const categoryRouter = require("./src/routers/CategoryRouter");
app.use("/category", categoryRouter);

const authRouter = require("./src/routers/AuthRouter");
app.use("/auth", authRouter);

const userRouter = require("./src/routers/UserRouter");
app.use("/user", userRouter);

const roleRouter = require("./src/routers/RoleRouter");
app.use("/role", roleRouter);


app.get("/storage", function (req, res) {
  console.log(__dirname);
  // fs.readFile(`${__dirname}${req.query.url}`, (err, data) => {
    // if(err) {
    //   res.status(500).json({
    //     code: 500,
    //     error: err,
    //   });
    // } else {
      res.sendFile(`${__dirname}${req.query.url}`);
    // }
  // })
});

app.get("/", function (req, res) {
  res.send("Hello World");
});

const port = process.env.PORT;
app.listen(port, function () {
  console.log(`Start listening on port ${port}!`);
});
