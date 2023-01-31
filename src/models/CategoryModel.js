const mongoose =require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  imageUrl: {
    type: String,
    required: false
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

module.exports = mongoose.model("CategoryModel", categorySchema);