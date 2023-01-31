const express = require("express");
const router = express.Router();
const dayjs = require("dayjs");
const { verifyToken } = require("../services/TokenService");
const {
  getRoles,
  saveRole,
  getRoleGroups,
} = require("../services/RoleService");

router.get("/getRoles", verifyToken, async (req, res) => {
  getRoles(req.user.roleGroupId)
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

// router.post("/saveRole", verifyToken, async (req, res) => {
//   let roleJson;
//   const hasId = req.body.hasOwnProperty("_id") && req.body._id;
//   if (hasId) {
//     // Updated mode
//     roleJson = {
//       ...req.body,
//       updatedDate: dayjs().format("YYYY-MM-DD HH:mm:ss"),
//       updatedUserId: req.user.id,
//     };
//   } else {
//     // Created mode
//     roleJson = {
//       ...req.body,
//       createdDate: dayjs().format("YYYY-MM-DD HH:mm:ss"),
//       createdUserId: req.user.id,
//     };
//   }

//   saveRole(roleJson, hasId, req.body._id)
//     .then((result) => {
//       res.status(201).json({
//         code: 201,
//         data: result,
//       });
//     })
//     .catch((err) => {
//       console.error(err);
//       res.status(500).json({
//         code: 500,
//         error: err,
//       });
//     });
// });

router.post("/saveRoleGroup", verifyToken, async (req, res) => {
  let roleGroupJson;
  const hasId = req.body.hasOwnProperty("_id") && req.body._id;

  if (hasId) {
    // Updated mode
    roleGroupJson = {
      ...req.body,
      updatedDate: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      updatedUserId: req.user.id,
    };
  } else {
    // Created mode
    roleGroupJson = {
      ...req.body,
      createdDate: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      createdUserId: req.user.id,
    };
  }

  saveRoleGroup(roleGroupJson, hasId, req.body._id)
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

router.get("/getRoleGroups", verifyToken, async (req, res) => {
  getRoleGroups()
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

module.exports = router;
