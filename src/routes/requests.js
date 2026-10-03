const express = require("express");
const requestRouter = express.Router();
const userAuth = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

requestRouter.post(
  "/requested/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id; // loggedInUser
      const toUserId = req.params.toUserId; // to whom user wants to send
      const status = req.params.status;

      const allowedStatus = ["ignored", "interested"];
      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: "Invalid Status Type " + status });
      }

      // Defined pre for Sankalp matches

      //If there is an existing connection request

      const exisitingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId }, // userA to userB check connection
          { fromUserId: toUserId, toUserId: fromUserId }, // userB to userA check connection
        ],
        // sankalp to suhas  is there connection ?
        // suhas to sankalp is there connection ?
      });

      if (exisitingConnectionRequest) {
        return res
          .status(400)
          .send({ message: "Connection Request Already Exists!!" });
      }

      //Check if toUserId  exist in db
      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(404).json({
          message: "User not Found",
        });
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

// Reviewing connection Request
requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    /*
     *  Akshay has sent elon a request 
     * Now Elon job is to review the request he can accept or reject the request
     * validate elon is loggedIn or no -> userAuth
     * now elon is loggedIn 
     * elon is sending :/status should be accepted / rejected if anything else error invalid status type
     * once u check it everthing is good then move forward
     * check in the connection Model did akshay -> elon connection exist in db collection connectionRequest 
     * you will get a requestId from params check that requestId exist in db
     * if it exists in db check toUserId is elon only na 
     * and the request akshay sent it belong elon only na toUserId
     * status : interested 
     * if anyof fails throw error immidetaly
     * if not found connection request -> Connection between them not exist
     * status : ignored then u can tell that he just skipped it
     * if all is fine go in that connectionRequest modify the 
     * status : interested -> accepted / rejected what elon done 
     * and write in the db and store it 
     */

    try {
    const loggedInUser = req.user; // Elon

    const {status , requestId} = req.params;// you need it later
    const toUserId = loggedInUser._id; // Elon Id

    const isAllowed = ["accepted","rejected"]; // he can send accept/reject

    if(!isAllowed.includes(status)){
      throw new Error("Status type is invalid it should be accepted/rejected")
    }

    const connectionRequest = await  ConnectionRequest.findOne({
      _id : requestId, //  checks if connection exist na in db
      toUserId:loggedInUser._id,  // verifies connection was coming to me na important security check point  
      // if u dont put toUserId u will accept any match that was never sent to you wrong management  
      status : "interested" // status was interested na 
    })

    console.log(connectionRequest);

    if(!connectionRequest){
      throw new Error("Connection Request Not Found")
    }

    connectionRequest.status = status; // modifying the exist connection request document in db 

    const data = await connectionRequest.save();

    res.json({
      message : "connection request  is " + status,
      data
    })


  }
  catch(e){
    res.status(401).send("Error " + e.message);
  }



    
  }
);


module.exports = requestRouter;

/*
* Security guard of your database 
* see pov of POST AND GET in different ways 
* Thought process -> POST vs GET 
* POST -> attacker can enter malicious data into db so always do checks before saving it into db
* GET -> attacker can get the data - make sure you only sending allowed data not leaking any senstive data from db to attacker 
*/