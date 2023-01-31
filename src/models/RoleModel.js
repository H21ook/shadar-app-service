const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  menuId: {
    type: Number,
    required: true,
  },
  createdDate: {
    type: String,
    required: true,
  },
  createdUserId: {
    type: String,
    required: true,
  },
  updatedDate: {
    type: String,
    required: false,
  },
  updatedUserId: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model("RoleModel", roleSchema);
