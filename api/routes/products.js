const express = require("express");
const UploadFiles = require("../../middleware/uploadFiles");
const router = express.Router();
const Products = require("../controllers/products");

router.get("/", Products.getAll);

router.post("/", UploadFiles.singleFile, Products.addProduct);

router.get("/:pId", Products.getById);

router.patch("/:pId", Products.editById);

router.delete("/:pId", Products.deleteById);

module.exports = router;
