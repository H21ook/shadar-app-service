const express = require("express");
const UserModel = require("../models/UserModel");
const { verifyToken } = require("../services/TokenService");
const router = express.Router();

router.get("/getProfile", verifyToken, (req, res) => {
  UserModel.findOne({ _id: req.user.id })
    .exec()
    .then((result) => {
      if (result) {
        res.status(201).json({
          code: 201,
          data: {
            _id: result._id,
            username: result.username,
            email: result.email,
            profileImgUrl: result.profileImgUrl,
            createdDate: result.createdDate,
          },
        });
      } else {
        res.status(201).json({
          code: 450,
          error: "Хэрэглэгч бүртгэлгүй байна!",
        });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({
        code: 500,
        error: err,
      });
    });
});


router.get("/getUsers", verifyToken, (req, res) => {
  UserModel.find()
    .exec()
    .then((result) => {
      res.status(201).json({
        code: 201,
        data: result.map(item => {
          return {
          _id: item._id,
          username: item.username,
          email: item.email,
          phoneNumber: item.phoneNumber,
          profileImgUrl: item.profileImgUrl,
          createdDate: item.createdDate,
          createdUserId: item.createdUserId,
          updatedDate: item.updatedDate,
          updatedUserId: item.updatedUserId,
          roleGroupId: item.roleGroupId
        }}),
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

module.exports = router;
