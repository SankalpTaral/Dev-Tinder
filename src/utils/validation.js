const validator = require("validator");
const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  // if (!firstName.length || !lastName) {
  //   throw new Error("Name is not valid");
  // }

  // you can keep it at db level or api level
  // else if (firstName.length < 4 || firstName.length > 50) {
  //   throw new Error("firstName should be between 4 to 50 characters");
  // } else if (!validator.isEmail(emailId)) {
  //   throw new Error("Email is not valid format please enter correct email");
  // }
};

const validateEditProfileData = (req) => {

    const data = req.body;
  if (!data) {
    throw new Error("Request body is missing");
  }

  const allowedEdits = ["gender", "firstName", "lastName"];

  if (Object.keys(data).length === 0) {
    throw new Error("No fields provided");
  }

  const isAllowedToEdit = Object.keys(data).every((key) =>
    allowedEdits.includes(key)
  );

  if (!isAllowedToEdit) {
    throw new Error("Invalid fields in update");
  }
  return isAllowedToEdit;
};

const isStrongPassword = (req) =>{
    const {oldPassword , newPassword} = req.body 
    if(!(validator.isStrongPassword(oldPassword) && validator.isStrongPassword(newPassword))){
        throw new Error("Password not that strong ")
    }
    else return true;
}
module.exports = {
  validateSignUpData,
  validateEditProfileData,
  isStrongPassword
};
