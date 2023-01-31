const mongoose =require('mongoose');

const branchSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  shortName: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  logoUrl: {
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
  }
});

module.exports = mongoose.model("BranchModel", branchSchema);