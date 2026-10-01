const express = require("express");
const requestRouter = express.Router();
const userAuth = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user")

requestRouter.post(
  "/requested/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id; // loggedInUser
      const toUserId = req.params.toUserId; // to whom user wants to send
      const status = req.params.status;

    

      const allowedStatus  = ["ignored","interested"];
      if(!allowedStatus.includes(status) ){
            return res.status(400).json({message: "Invalid Status Type " + status})
      }

      // Defined pre for Sankalp matches 

      //If there is an existing connection request

      const exisitingConnectionRequest = await ConnectionRequest.findOne({
        $or :[
            {fromUserId ,toUserId}, // userA to userB check connection
            {fromUserId:toUserId , toUserId : fromUserId} // userB to userA check connection
        ],
        // sankalp to suhas  is there connection ?
        // suhas to sankalp is there connection ?

      })

       if(exisitingConnectionRequest){
        return  res.status(400)
        .send({message : "Connection Request Already Exists!!"})
        }


        //Check if toUserId  exist in db 
        const toUser = await User.findById(toUserId);
        if(!toUser){
            return res.status(404).json({
                message : "User not Found"
            })
        }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();

      res.json({
        message: "Connection Request Succesfully",
        data,
      });
    } catch (e) {
      res.status(400).send("ERROR" + e.message);
    }
  },
);
module.exports = requestRouter;
