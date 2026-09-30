const express = require('express');
const {validateSignUpData} = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");
/*
* Both are the same app and router 
const app = express();
const router = express.Router();
*/
const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    //Step 1: Validation of data
    validateSignUpData(req);
    /**
     * standard industry pratice to keep code clean
     */

    const { firstName, emailId, lastName, password } = req.body;

    //Step 2: Encrypt the password

    const passwordHash = await bcrypt.hash(password, 10);

    console.log(passwordHash);
    // the more encryption salt level more tuff to break ideal salt round range is  10

    //Create a new instance of User Model
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    await user.save();
    res.status(200).send("User Added Succesfully");
  } catch (err) {
    res.status(400).send("Interal Server Error" + err);
  }
});


authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await user.ValidatePassword(password);
    if (!isPasswordValid) {
      throw new Error("Password mismatch");
    }
    const token = await user.getJWT();
    res.cookie("token", token);
    res.send("Login Successfully");
  } catch (e) {
    res.status(500).send("Interal Server Error" + e);
  }
});

authRouter.post("/logout",async (req,res) =>{
 // why post because http design create/trigger any action use post 
 // no auth needed not doing anything  depends upon the app 
 // in big companies cleanup from the db logs and all 
    res.cookie("token",null,
    {expires : new Date(0), }) // expire now 
    res.send("Logged Out Succesfully")
})


module.exports = authRouter;