const express = require("express");
require("dotenv").config();

const bodyParser = require('body-parser');

const connectToMongoDB = require("./config/database");

const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const todoRouter = require("./routes/todo");

const app = express();

connectToMongoDB();


app.use(bodyParser.json());


app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/todos", todoRouter);

const port = process.env.PORT || 8000;
app.listen(port, () =>
  console.log(`Server is listening on http://localhost:${port}`)
);
