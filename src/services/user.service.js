const { User } = require("../schema").User;
const { generateHash, isValidPassword } = require("../common/password");

const createUser = async (firstName, lastName, email, password) => {
  const user = new User({
    firstName,
    lastName,
    email,
    password: generateHash(password),
  });
  await user.save();
  return user;
};

const auth = async (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
};

const findUserById = async(user_id) => {
  return await User.findById(user_id).select("firstName lastName");
}

const updateUser = async(firstName, lastName, user_id) => {
  const updated = await User.findOneAndUpdate({_id: user_id}, {$set: {firstName, lastName}}, {returnDocument: 'after'});
  return updated;
}

const resetPassword = async (cpswd, pswd, rpswd, user_id) => {
  if(pswd !== rpswd) {
    return {success: false, message: 'both new password should match'};
  }

  if(pswd.length < 6) {
    return {success: false, message: 'password length should more than 5'};
  }

  const user = await User.findById(user_id);
  if(!isValidPassword(cpswd, user.password)) {
    return {success: false, message: 'currenct password is wrong'};
  }

  const newHash = generateHash(pswd);
  user.password = newHash;
  await user.save();
  return {success: true, message: 'you successfully reset the password'}
}
module.exports = { createUser, auth, findUserById, updateUser, resetPassword };
