const express = require("express");
const NewsModel = require("../models/NewsModel");
const router = express.Router();
const dayjs = require("dayjs");
const BranchModel = require("../models/BranchModel");
const CategoryModel = require("../models/CategoryModel");
const { fileUpload } = require("../services/UtilService");
const { verifyToken } = require("../services/TokenService");

router.get("/getLastNews", verifyToken, async (req, res) => {
  try {
    const categories = await CategoryModel.find();
    const branches = await BranchModel.find();

    NewsModel.find()
      .limit(1)
      .sort({ createdDate: -1 })
      .exec()
      .then((result) => {
        res.status(201).json({
          code: 201,
          data: {
            ...result[0]._doc,
            branch: branches.find((b) => {
              return b.id === result[0].branchId;
            }),
            category: categories.find((c) => c.id === result[0].categoryId),
          },
        });
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({
          code: 500,
          error: err,
        });
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      code: 500,
      error: err,
    });
  }
});

router.get("/getNews", verifyToken, async (req, res) => {
  try {
    const categories = await CategoryModel.find();
    const branches = await BranchModel.find();

    NewsModel.find()
      .skip((Number(req.query.page) - 1) * Number(req.query.size))
      .limit(Number(req.query.size))
      .sort({ createdDate: -1 })
      .exec()
      .then((result) => {
        res.status(201).json({
          code: 201,
          data: result.map((item) => {
            return {
              ...item._doc,
              branch: branches.find((b) => {
                return b.id === item.branchId;
              }),
              category: categories.find((c) => c.id === item.categoryId),
            };
          }),
        });
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({
          code: 500,
          error: err,
        });
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      code: 500,
      error: err,
    });
  }
});

router.delete("/deleteNews", verifyToken, async (req, res) => {
  NewsModel.findByIdAndDelete(req.query.id)
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

router.post("/saveNews", verifyToken, (req, res) => {
  if (req.files && req.files.file) {
    fileUpload(req.files.file).then(fileRes => {
      if (!fileRes.uploaded) {
        if(fileRes.code === 500) {
          res.status(500).json({
            code: 500,
            error: fileRes.error,
          });
        } else {
          res.status(201).json({
            code: fileRes.code,
            error: fileRes.error,
          });
        }
      } else {
        req.body.imageUrl = fileRes.data.fileUrl;
        saveNews(req.body, res);
      }
    });
    return;
  }
  saveNews(req.body);
});

const saveNews = (reqBody, res) => {
  let newsJson;
  const hasId = reqBody.hasOwnProperty("_id") && reqBody._id;
  if (hasId) {
    // Updated mode
    newsJson = {
      ...reqBody,
      updatedDate: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      updatedUserId: req.user.id,
    };
  } else {
    // Created mode
    newsJson = {
      ...reqBody,
      createdDate: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      createdUserId: req.user.id,
    };
  }

  const newsModel = new NewsModel({
    title: newsJson.title,
    description: newsJson.description,
    imageUrl: newsJson.imageUrl,
    categoryId: newsJson.categoryId,
    branchId: newsJson.branchId,
    createdDate: newsJson.createdDate,
    createdUserId: newsJson.createdUserId,
    updatedDate: newsJson.updatedDate,
    updatedUserId: newsJson.updatedUserId,
  });

  if (hasId) {
    console.log("Update body: ", newsJson);
    NewsModel.findByIdAndUpdate(reqBody._id, newsJson)
      .exec()
      .then((result) => {
        return res.status(201).json({
          code: 201,
          data: result,
        });
      })
      .catch((err) => {
        console.error(err);
        return res.status(500).json({
          code: 500,
          error: err,
        });
      });
  } else {
    delete newsJson._id;
    console.log("Insert body: ", newsJson);
    newsModel
      .save()
      .then((result) => {
        return res.status(201).json({
          code: 201,
          data: result,
        });
      })
      .catch((err) => {
        console.error(err);
        return res.status(500).json({
          code: 500,
          error: err,
        });
      });
  }
};
module.exports = router;
