const mongoose =require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: false
  },
  profileImgUrl: {
    type: String,
    required: false
  },
  password: {
    type: String,
    required: true
  },
  createdDate: {
    type: String,
    required: true
  },
  createdUserId: {
    type: String,
    required: true
  },
  updatedDate: {
    type: String,
    required: false
  },
  updatedUserId: {
    type: String,
    required: false
  },
  roleGroupId: {
    type: String,
    required: false
  }
});

module.exports = mongoose.model("UserModel", userSchema);