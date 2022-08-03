const e = require("express");
const multer = require("multer");

class UploadFiles {
  constructor() {
    this.fileSize = 1024 * 1024 * 5;
    this.fileFilter = (res, file, callback) => {
      if (
        file.mimetype === "image/jpeg" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/png"
      ) {
        callback(null, true);
      } else {
        callback({ message: `not support ${file.mimetype} file`, type: file.mimetype }, false);
      }
    };
    this.storage = multer.diskStorage({
      destination: (req, file, callback) => {
        callback(null, "./uploads/");
      },
      filename: (req, file, callback) => {
        callback(null, Date.now() + file.originalname);
      },
    });

    this.upload = multer({
      storage: this.storage,
      limits: { fileSize: this.fileSize },
      fileFilter: this.fileFilter,
    }).single("productImage");
  }

  singleFile = (req, res, next) => {
    return this.upload(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
        return res.status(400).json({
          message: err.message,
        });
      } else if (err) {
        // An unknown error occurred when uploading.
        let error = null;
        switch (err?.message) {
          case `not support ${err.type} file`:
            error = 400;
            break;

          default:
            error = 500;
            break;
        }

        return res.status(error || 500).json({
          message: "something goes wrong",
          err: err.message,
        });
      }
      next();
    });
  };
}

module.exports = new UploadFiles();
