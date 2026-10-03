const express = require('express')
const ConnectionRequest = require("../models/connectionRequest")
const userAuth = require("../middlewares/auth")
const userRouter = express.Router();


 const USER_SAFE_DATA = "firstName  age gender skills" 
// Find all the connectionRequest that other people sent to loggedInUser

userRouter.get("/user/requests/recieved",userAuth , async (req,res)=>{
    const loggedInUser = req.user 
    // stauts : interested ignored then just leave it 
    // i need to get all the request that come to me and status : interested

    const connectionRequests = await ConnectionRequest.find({
        toUserId : loggedInUser._id,
        status : "interested"
    }).populate("fromUserId",USER_SAFE_DATA)
    res.send(connectionRequests);
})


userRouter.get("/user/connections" ,userAuth , async (req,res)=>{
    try{
   const loggedInUser = req.user;

        const connections = await ConnectionRequest.find({
    $or : [
            {toUserId:loggedInUser._id, status :"accepted"}, 
            {fromUserId : loggedInUser._id , status : "accepted"}
          ]
})
// your not sure like ur sender / reciever so u populate both map will decide
.populate("fromUserId",USER_SAFE_DATA)
  .populate("toUserId",USER_SAFE_DATA);


  // this data will return me the exact if  im 
  // connections u have both sender + reciever u need to decide 
  // sender->receiver if reciever->sender you decide it using
  // this below map function u write logic and create a new array
  // called data and return it in form of response 
const data = connections.map((row)=>{
    if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
        return row.toUserId
    }
    return row.fromUserId;
})
  res.json({
        message : "Sent All Connections",
        data
    })
}catch(err){
        res.status(401).send("Error" , err.message);
     }
})

module.exports = userRouter;
