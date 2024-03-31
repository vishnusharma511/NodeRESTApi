const express = require("express");
require("dotenv").config();

const bodyParser = require('body-parser');

const connectToMongoDB = require("./config/database");

const userRouter = require("./routes/user");

const app = express();

connectToMongoDB();


app.use(bodyParser.json());


app.use("/users", userRouter);


const port = process.env.PORT || 8000;
app.listen(port, () =>
  console.log(`Server is listening on http://localhost:${port}`)
);
