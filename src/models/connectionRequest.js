const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    //Sender
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true, 
    },

    //Reciever
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    status: {
      type: String,
      //It ensures that only specific values can be stored in a field.
      enum: {
        values: ["ignored", "accepted", "rejected", "interested"],
        // if above values user does'nt includes then error will be thrown
        // and down message will be displayed value is incorrect status type
        message: `{VALUE} is incorrect status type`,
      },
      required: true,
    },
  },
  { timestamps: true },
);

// Learning ways of validation Before saving .save this pre runs
// connectionRequestSchema.pre("save", async function(next) {
//   const connectionRequest = this;
//   // current document being saved
//   // from here only u get fromUserId and toUserId
//   //Check if fromUserId is same as toUserId
//   /*
//     this refers to this document 
//       const connectionRequest = new ConnectionRequest({
//             fromUserId,
//             toUserId,
//             status,
//           });
//           mongoose automatically passes this before it performs save 
//           Note:pre("save") runs before the document is saved to the database
// —not “passed”, but triggered automatically by Mongoose when .save() is called
//           */

//   if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
//     throw new Error("Cannot send connection request to yourself");
//   }

//   // remember to call next
//   next();
// });

connectionRequestSchema.pre("save", async function () {
  const connectionRequest = this;

  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error("Cannot send connection request to yourself");
  }
});


 // Compound index when multiple fields are there  to make queries fast 

 connectionRequestSchema.index({fromUserId : 1 , toUserId : 1})
 

const ConnectionRequestModel = new mongoose.model(
  "Connection Request",
  connectionRequestSchema,
);

module.exports = ConnectionRequestModel;
