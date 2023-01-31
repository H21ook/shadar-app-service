const path = require("path");
const { v4: uuidv4 } = require('uuid');

const fileUpload = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      resolve({
        uploaded: false,
        code: 450,
        error: "Файл хавсаргаагүй байна!",
      });
    }
    const extName = path.extname(fileName);
    const fileName = `${uuidv4()}${extName}`;
    const filePath = path.join("uploads/", fileName);
    const fileUrl = `https://shadar-said.tugscom.mn/api/storage?url=/uploads/${fileName}`;
    const imageExtList = [".png", ".jpg", ".jpeg"];

    if (!imageExtList.includes(extName)) {
      resolve({
        uploaded: false,
        code: 450,
        error: "Файлын формат буруу байна!",
      });
    } else {
      file.mv(filePath, (err) => {
        if (err) {
          console.error(err);
          resolve({
            uploaded: false,
            code: 500,
            error: err,
          });
        } else {
          resolve({
            uploaded: true,
            data: {
              fileName,
              filePath,
              fileUrl,
            },
          });
        }
      });
    }
  });
};

module.exports = {
  fileUpload,
};
