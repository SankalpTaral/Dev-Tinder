const express = require("express");
const profileRouter = express.Router();
const { validateEditProfileData } = require("../utils/validation");
const userAuth = require("../middlewares/auth");
const User = require("../models/user");
const { isStrongPassword } = require("../utils/validation");
const bcrypt = require("bcrypt");

profileRouter.get("/profile", userAuth, async (req, res) => {
  //  you will get it from userAuth
  res.send(req.user);
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    // user Auth if he is logged in then he can edit is

    if (!validateEditProfileData(req)) {
      res.status(400).send("Invalid edit fields");
    }
    const user = req.user;

    const data = req.body;

    console.log(user);

    const { _id } = user; // get the id from the user

    // go and find this id in the document of mongodb

    const updatedUser = await User.findByIdAndUpdate(
      _id,
      { $set: data },
      { new: true },
    );
    res.send({
      message: "User updated Succesfully",
      updatedUser,
    });
  } catch (error) {
    res.status(400).send("Error" + error);
  }
});

profileRouter.post("/profile/changePassword", userAuth, async (req, res) => {
  try {
    const user = req.user;

    // Step 1 : validate email format coming from request body
    const check = isStrongPassword(req);

    //Step 2 : Now comapre old password and new password

    const { oldPassword, newPassword } = req.body;

    const { _id } = user;

    console.log(oldPassword, newPassword);

    const checkPasswordMatch = await bcrypt.compare(oldPassword, user.password);

    if (!checkPasswordMatch) {
      throw new Error("Password doesnt match ");
    }

    // If password matches then now hash the new password coming from body and save it in db

    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    user.password = newPasswordHash;

    await user.save();

    res.send({
      message: "User password changed",
      user,
    });
  } catch (error) {
    res.status(400).send("Error" + error.message);
  }
});

module.exports = profileRouter;

// $2b$10$l/5ACUxa0HWX9kzYA.uoveQ4PVBTXte.QSwS4Q9ZhC4/bX86VzM3q
// $2b$10$/7xCSQtyqr/OUBO/df7fTugCY0Up6eHK6bB.pJfiYObmKrtU7.IUq
