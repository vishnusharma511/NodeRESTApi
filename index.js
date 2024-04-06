const express = require("express");
require("dotenv").config();

const bodyParser = require('body-parser');

const connectToMongoDB = require("./config/database");
const config = require("./config/config");

const { authenticateToken } = require('./middleware/authenticateToken');
const { authorize } = require('./middleware/authorize');

const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const todoRouter = require("./routes/todo");

const app = express();

connectToMongoDB();


app.use(bodyParser.json());


app.use("/auth", authRouter);
app.use("/users",authenticateToken, authorize('admin'), userRouter);
app.use("/todos",authenticateToken, todoRouter);

const port = config.get('port');
app.listen(port, () =>
  console.log(`Server is listening on http://localhost:${port}`)
);
