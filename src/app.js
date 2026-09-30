const express = require("express");
const connectDB = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");

app.use(express.json()); // parsing reqBody
app.use(cookieParser()); // parsing cookie

// request comes here so u need to import it 
const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/requests')

app.use("/",authRouter);
app.use("/",profileRouter)
app.use("/",requestRouter);

// Following Best Pratice Make Db Connection then make your server start listening
connectDB()
  .then(() => {
    console.log("Connected to database");
    app.listen(4000, () => {
      console.log("Server running on port 4000");
    });
  })
  .catch((err) => {
    console.error("Database connection failed", err);
  });
