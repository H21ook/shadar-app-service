const express = require("express");
const CategoryModel = require("../models/CategoryModel");
const router = express.Router();
const dayjs = require("dayjs");
const { verifyToken } = require("../services/TokenService");

router.get("/getCategories", verifyToken, async (req, res) => {
  CategoryModel.find()
    .exec()
    .then((result) => {
      res.status(201).json({
        code: 201,
        data: result,
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({
        code: 500,
        error: err,
      });
    });
});

router.delete("/deleteCategory", verifyToken, async (req, res) => {
  CategoryModel.findByIdAndDelete(req.query.id)
    .exec()
    .then((result) => {
      res.status(201).json({
        code: 201,
        data: result,
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({
        code: 500,
        error: err,
      });
    });
});

router.post("/saveCategory", verifyToken, async (req, res) => {
  let categoryJson;
  const hasId = req.body.hasOwnProperty("_id") && req.body._id;
  if (hasId) {
    // Updated mode
    categoryJson = {
      ...req.body,
      updatedDate: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      updatedUserId: req.user.id,
    };
  } else {
    // Created mode
    categoryJson = {
      ...req.body,
      createdDate: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      createdUserId: req.user.id,
    };
  }

  const categoryModel = new CategoryModel({
    name: categoryJson.name,
    description: categoryJson.description,
    imageUrl: categoryJson.imageUrl,
    createdDate: categoryJson.createdDate,
    createdUserId: categoryJson.createdUserId,
    updatedDate: categoryJson.updatedDate,
    updatedUserId: categoryJson.updatedUserId,
  });

  if (hasId) {
    console.log("Update body: ", categoryJson);
    CategoryModel
      .findByIdAndUpdate(req.body._id, categoryJson)
      .exec()
      .then((result) => {
        res.status(201).json({
          code: 201,
          data: result,
        });
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({
          code: 500,
          error: err,
        });
      });
  } else {
    console.log("Insert body: ", categoryJson);
    categoryModel
      .save()
      .then((result) => {
        res.status(201).json({
          code: 201,
          data: result,
        });
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({
          code: 500,
          error: err,
        });
      });
  }
});

module.exports = router;
