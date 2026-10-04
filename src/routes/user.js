const express = require('express')
const ConnectionRequest = require("../models/connectionRequest")
const userAuth = require("../middlewares/auth")
const userRouter = express.Router();
const Users = require("../models/user");
const User = require('../models/user');


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

// Get all matches of loggedin user 

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

  if(!connections){
    throw new Error("No connections/matches found");
  }


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

userRouter.get("/feed", userAuth , async (req,res)=>{
    try{
      
      /* User should see all the user cards except
       * 1. his own card or profile
       * 2. card of his connections (matches)
       * 3. ignored people
       * 4. already sent the connection request
       
      Example : Akshay , Elon , Mark , Ms Dhoni , Virat , Donald
        New User he registers
        Rahul Feed = [ Akshay , Elon , Mark , Ms Dhoni , Virat, Donald]

        Rahul ---> Akshay sent a connection 
        Rahul Feed =  [Elon , Mark , Ms Dhoni , Virat, Donald]

        Rahul -> Akshay  Akshay rejected it 
        Rahul -> Elon sent a connection
        Rahul Feed = [Mark , Ms Dhoni , Virat, Donald]


        */ 


       
        const loggedInUser = req.user;

      //  --------------------Pagination Start Code ------------------------


        const page = parseInt(req.query.page) || 1 // page=2 this 2 comes in string format convert it to number

        let limit = parseInt(req.query.limit) || 10 // if fe doesnt pass the limit like u dont get limit then assume limit as 10
        
        // sanitise limit if limit is given a random big number it will display all users

        // if passing more than 50 limit 70 i pass only 50 users will be show 
        limit = limit > 50 ? 50 : limit;


        // if page doesnt not exist it is throwing me an empty array

        const totalUsers = await User.countDocuments(); // this will count the users

        const totalPages  = Math.ceil(totalUsers/limit)


        // exceeds page limit extra safety check
            if (page > totalPages) {
            return res.status(404).json({
                success: false,
                message: "Page not found"
            });
            }

            // if you passed page in negative such as -1 limit = 10
            // skip = (-1-1) = -2 * 10 i cant skip(-20) what is that mongo db skip -20 users means no concept of minus and all
            // throws error that tells skip value should be > or equal to 0

        const skip =(page -1) * limit



        // skip calculation formula

        /**
         * skip(page-1)*limit
         * if   i on page 3 
         * (3-1) = 2 * 10(limit) = 20
         * skip 20 users 
         */




    //  --------------------Pagination End Code ------------------------
        // Find all connection request that i have (sent / recieved)

        const connectionRequest = await ConnectionRequest.find({
          $or:[
            {fromUserId : loggedInUser._id},
            {toUserId:loggedInUser._id }
          ]  
        }).select("fromUserId toUserId").populate("fromUserId" ,"firstName")
        .populate("toUserId", "firstName");


        const hideUsersFromFeed = new Set();

        connectionRequest.forEach((req)=>{
            hideUsersFromFeed.add(req.fromUserId._id.toString());
            hideUsersFromFeed.add(req.toUserId._id.toString());
        })

        console.log(hideUsersFromFeed);

        const users = await Users.find({
            $and :[
                {_id : {$nin: Array.from(hideUsersFromFeed)}},
                {_id : {$ne : loggedInUser._id}}
            ]
        }).select("firstName , emailId")
        .skip(skip) // calculate it how many u want skip
        .limit(limit) // limit u need to pass 

        console.log(users);

        

        res.json({users});


    }catch(err){
        res.status(401).json( {message : "Error " + err.message})
    }
})

module.exports = userRouter;
