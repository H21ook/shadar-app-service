const express = require("express");
const BranchModel = require("../models/BranchModel");
const router = express.Router();
const dayjs = require("dayjs");
const { fileUpload } = require("../services/UtilService");
const { verifyToken } = require("../services/TokenService");

router.get("/getBranches", verifyToken, async (req, res) => {
  BranchModel.find()
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

router.delete("/deleteBranch", verifyToken, async (req, res) => {
  BranchModel.findByIdAndDelete(req.query.id)
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

router.post("/saveBranch", verifyToken, async (req, res) => {
  if (req.files && req.files.file) {
    fileUpload(req.files.file).then((fileRes) => {
      if (!fileRes.uploaded) {
        res.status(500).json({
          code: 500,
          error: fileRes.error,
        });
      } else {
        req.body.logoUrl = fileRes.data.fileUrl;
        saveBranch(req.body, res);
      }
    });
    return;
  }
  saveBranch(req.body);
});

const saveBranch = (branchBody, res) => {
  let branchJson;
  const hasId = branchBody.hasOwnProperty("_id") && branchBody._id;
  if (hasId) {
    // Updated mode
    branchJson = {
      ...branchBody,
      updatedDate: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      updatedUserId: req.user.id,
    };
  } else {
    // Created mode
    branchJson = {
      ...branchBody,
      createdDate: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      createdUserId: req.user.id,
    };
  }

  const branchModel = new BranchModel({
    name: branchJson.name,
    shortName: branchJson.shortName,
    description: branchJson.description,
    logoUrl: branchJson.logoUrl,
    createdDate: branchJson.createdDate,
    createdUserId: branchJson.createdUserId,
    updatedDate: branchJson.updatedDate,
    updatedUserId: branchJson.updatedUserId,
  });

  if (hasId) {
    console.log("Update body: ", branchJson);
    BranchModel.findByIdAndUpdate(branchBody._id, branchJson)
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
    console.log("Insert body: ", branchJson);
    branchModel
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
};

module.exports = router;
