const jwt = require("jsonwebtoken");
const User = require("../models/user");
const userAuth = async (req, res, next) => {
  // Read the token from request cookies

  
  console.log("Entering user Auth before hitting an api")

  try {
    const cookies = req.cookies;
  
    console.log("Cookies ", cookies);

    const { token } = cookies;
    console.log("token", token);

    if(!token){
      throw new Error ("Token Not Found")
    }

    // Validate the token
    const decodedObj = jwt.verify(token,"DEV@Tinder$790");

    console.log(decodedObj);
    const { _id } = decodedObj;
    // Find the User
    const user = await User.findById(_id);

    if (!user) {
      throw new Error("User not found");
    }
    //Attach user to the request

    console.log(req.user);
    req.user = user;

    // console.log("yoo")

    // console.log(req.user);
    

    next(); // to move to the request handler
  } catch (error) {
    // if user does not exist it will not even go to api function 
    res.status(400).send("Error" + error.message);
    
  }
};

module.exports = userAuth;
