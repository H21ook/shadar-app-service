const express = require("express");
const router = express.Router();
const dayjs = require("dayjs");
const bcrypt = require("bcryptjs");
const UserModel = require("../models/UserModel");
const { signIn, verifyToken } = require("../services/TokenService");
const { fileUpload } = require("../services/UtilService");

const generatePassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

router.get("/checkLogin", verifyToken, async (req, res) => {
  res.status(201).json({
    code: 201,
    data: req.header("Authorization").substring(7),
  });
});

router.post("/login", async (req, res) => {
  const user = req.body;

  UserModel.findOne({ username: user.username })
    .exec()
    .then((result) => {
      if (result) {
        bcrypt.compare(user.password, result.password).then((validate) => {
          if (!validate) {
            res.status(201).json({
              code: 450,
              error: "Нэвтрэх нэр эсвэл нууц үг буруу байна!",
            });
          } else {
            signIn(result._id, result.roleGroupId)
              .then((token) => {
                res.status(201).json({
                  code: 201,
                  data: token,
                });
              })
              .catch((err) => {
                res.status(500).json({
                  code: 500,
                  data: err,
                });
              });
          }
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

saveUser = (req, res) => {
  const user = req.body;
  let userJson;
  const hasId = user.hasOwnProperty("_id") && user._id;
  if (hasId) {
    userJson = {
      _id: user._id,
      email: user.email,
      phoneNumber: user.phoneNumber,
      roleGroupId: user.roleGroupId,
      profileImgUrl: user.profileImgUrl,
      createdDate: user.createdDate,
      createdUserId: user.createdUserId,
      updatedDate: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      updatedUserId: req.user.id,
    };

    UserModel.findByIdAndUpdate(user._id, userJson)
      .exec()
      .then((result) => {
        return res.status(201).json({
          code: 201,
          data: {
            _id: result._id,
            username: result.username,
            email: result.email,
            phoneNumber: result.phoneNumber,
            profileImgUrl: result.profileImgUrl,
            createdDate: result.createdDate,
            createdUserId: result.createdUserId,
            updatedDate: result.updatedDate,
            updatedUserId: result.updatedUserId,
            roleGroupId: result.roleGroupId
          },
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
    UserModel.findOne({ username: user.username })
      .exec()
      .then((result) => {
        if (result) {
          res.status(201).json({
            code: 450,
            error:
              "Нэвтрэх нэр ашиглагдсан байна. Өөр нэвтрэх нэр ашиглана уу!",
          });
        } else {
          const userJson = {
            ...user,
            createdDate: dayjs().format("YYYY-MM-DD HH:mm:ss"),
            createdUserId: 1,
          };
          generatePassword(userJson.password).then((pass) => {
            const user = new UserModel({
              username: userJson.username,
              password: pass,
              email: userJson.email,
              phoneNumber: userJson.phoneNumber,
              profileImgUrl: userJson.profileImgUrl,
              roleGroupId: userJson.roleGroupId,
              createdDate: userJson.createdDate,
              createdUserId: userJson.createdUserId,
              updatedDate: userJson.updatedDate,
              updatedUserId: userJson.updatedUserId,
            });

            user
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
  }
};

router.post("/register", verifyToken, (req, res) => {
  if (req.files && req.files.file) {
    fileUpload(req.files.file).then((fileRes) => {
      if (!fileRes.uploaded) {
        if (fileRes.code === 500) {
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
        req.body.profileImgUrl = fileRes.data.fileUrl;
        saveUser(req, res);
      }
    });
    return;
  }
  saveUser(req, res);
});

router.get("/logout", async (req, res) => {
  return res.status(201).json({
    code: 201,
    data: "Logout",
  });
});
module.exports = router;
