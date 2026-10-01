const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); 

const userSchema = new mongoose.Schema({
    firstName : {
        type : String,
        required : true, // user need to give firstName else mongoose will not allow insertion in db
        minLength : 4 ,// if length < 4 then it will not add to db 
        maxLength : 50 // if length > 50  then it will not add to db 
    },
    lastName :{
        type : String
    },
    emailId : {
       type : String,
       required : true,
       unique : true, // emailId duplicacy wont work if u try to add user with same existing emailId on db it will throw Error
       lowercase : true,  // if user enters emailId case anyhow to maintain consistency  like doesnt matter how user enters ill store all of it in lowercase
       trim : true, // to ensure before and after spaces to delete "   sankalptaral345@gmail.com " it will store -> "sankalptaral345@gmail.com" no whitespaces added 

       // third party email validator npm i validator 
      validate(value){
        if(!validator.isEmail(value)){
            throw new Error ("Invalid email address")
        }
      }
    },
     password : {
        type : String,
        required : true,
        validate(value){
          if(!validator.isStrongPassword(value)){
            throw new Error ("Enter a Strong password")
          }
        }
    },
    age : {
        type : Number
    },
    gender : {
        type : String,
        //validate function if user enters anything apart from given genders he will not be able to add to db
        // but there is catch this validate function will only work if that document is not present in the db
        // if the document is present in db and u updated the gender : "hello" this will work which is wrong right 
        // so in patch you need to do runValidators : true
        // validate(value){
        //     if(!["male","female","others"].includes(value)){
        //         throw new Error("Gender not valid ")
        //     }
        // }

        enum : {
            values : ["male","female","others"],
            message : `{VALUE}i s incorrect status}`
        }
    },
    preference : {
        type : String
    },

    photoUrl : {
        type :String,
        default : "https://img.magnific.com/premium-vector/translator-icon_1076610-18679.jpg?semt=ais_hybrid&w=740&q=80"
    },

    about : {
        type : String,
        default: "This is a default about of user" // if user doesnt give this field the default value will be stored ->  about : This is a default about of user
    },

    // skills : {
    //     type : [String], // if not given it stores empty array  skills-> Array (empty)
    //     validate : function(arr){
    //     if (!arr) return true; // optional field
    //      return arr.length >= 1 && arr.length <= 5;  // if its between 2 to 5 returns true if not returns false
    //     }
    // },
    // createdAtt : {
    //     type : Date,
    //     default : Date
    // } // mongoose instead of doing manually mongoose gives second argument timestamps : updated and createdAt helps in sorting and all find all the users in the particular range 
}, {timestamps : true})



// You can use schemaMethods to make code clean

// important part is never use arrow functions use normal functions here
// because ur using this keyword here so 

userSchema.methods.ValidatePassword = async function(passwordInput){
    const user = this; // current document

    const isValidPassword = await bcrypt.compare(passwordInput,user.password);

    return isValidPassword;
}


 
userSchema.methods.getJWT = function (){
 const user = this; // refers to the user document who is making request
    // Here u will create a jwt token 
 const token = jwt.sign({ _id: user._id }, "DEV@Tinder$790" ,{expiresIn : "1d"}); // "qweu93ue93uw9eu23"

 return token;
}





const User = mongoose.model("User", userSchema)

module.exports = User;