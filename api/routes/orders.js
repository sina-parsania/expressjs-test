const express = require("express");
const router = express.Router();
const Orders = require("../controllers/orders");

router.get("/", Orders.getAll);

router.post("/", Orders.addOrder);

router.get("/:orderId", Orders.getById);

router.put("/:orderId", Orders.editById);

router.delete("/:orderId", Orders.deleteOrders);

module.exports = router;
