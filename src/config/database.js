const mongoose = require('mongoose')

// wrapped it inside a function so that i can call it in app.js main server file
const connectDb = async()=>{
    await mongoose.connect(
    "mongodb+srv://sankalptaral345_db_user:cCiBhloTdUahYxF2@cluster0.n5htn3b.mongodb.net/devTinder"
);
}

module.exports = connectDb