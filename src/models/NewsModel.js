const mongoose =require('mongoose');

const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  categoryId: {
    type: String,
    required: true
  },
  branchId: {
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

module.exports = mongoose.model("NewsModel", newsSchema)