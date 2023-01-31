const RoleGroupModel = require("../models/RoleGroupModel");
const RoleModel = require("../models/RoleModel");

getRoles = (roleGroupId) => {
  return new Promise((resolve, reject) => {
    RoleGroupModel.findById(roleGroupId)
      .exec()
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

// saveRole = (roleJson, hasId, _id) => {
//   return new Promise((resolve, reject) => {
//     const roleModel = new RoleModel({
//       name: roleJson.name,
//       menuId: roleJson.menuId,
//       roleGroupId: roleJson.roleGroupId,
//       createdDate: roleJson.createdDate,
//       createdUserId: roleJson.createdUserId,
//       updatedDate: roleJson.updatedDate,
//       updatedUserId: roleJson.updatedUserId,
//     });

//     if (hasId) {
//       console.log("Update body: ", roleJson);
//       RoleModel.findByIdAndUpdate(_id, roleJson)
//         .exec()
//         .then((result) => {
//           resolve(result);
//         })
//         .catch((err) => {
//           reject(err);
//         });
//     } else {
//       console.log("Insert body: ", roleJson);
//       roleModel
//         .save()
//         .then((result) => {
//           resolve(result);
//         })
//         .catch((err) => {
//           reject(err);
//         });
//     }
//   });
// };

saveRoleGroup = (roleGroupJson, hasId, _id) => {
  return new Promise((resolve, reject) => {
    const roleGroupModel = new RoleGroupModel({
      name: roleGroupJson.name,
      menuId: roleGroupJson.menuId,
      createdDate: roleGroupJson.createdDate,
      createdUserId: roleGroupJson.createdUserId,
      updatedDate: roleGroupJson.updatedDate,
      updatedUserId: roleGroupJson.updatedUserId,
    });

    if (hasId) {
      console.log("Update body: ", roleGroupJson);
      RoleGroupModel.findByIdAndUpdate(_id, roleGroupJson)
        .exec()
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    } else {
      console.log("Insert body: ", roleGroupJson);
      roleGroupModel
        .save()
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    }
  });
};

// groupUpdateInRole = (rolesId, roleGroupId) => {
//   // Ehleed huuchin groupId-g ustgana
//   RoleModel.updateMany(
//     { roleGroupId: { $in: roleGroupId } },
//     { roleGroupId: null }
//   )
//     .exec()
//     .then((result) => {
//       RoleModel.updateMany(
//         { _id: { $in: rolesId } },
//         { roleGroupId: roleGroupId }
//       )
//         .exec()
//         .then((result) => {
//           resolve(result);
//         })
//         .catch((err) => {
//           reject(err);
//         });
//     })
//     .catch((err) => {
//       reject(err);
//     });
// };

getRoleGroups = () => {
  return new Promise((resolve, reject) => {
    RoleGroupModel.find()
      .exec()
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

module.exports = {
  getRoles,
  // saveRole,
  saveRoleGroup,
  getRoleGroups
};
