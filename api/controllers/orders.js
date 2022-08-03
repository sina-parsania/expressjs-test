const Order = require("../../models/order");
const Product = require("../../models/product");
const mongoose = require("mongoose");

class Orders {
  getAll = (req, res) => {
    Order.find()
      .select("productId quantity")
      .populate(req.query.name === "true" ? "productId" : "")
      .exec()
      .then((docs) => {
        const response = {
          count: docs.length,
          orders: docs.map((doc) => {
            return {
              productId: doc.productId,
              quantity: doc.quantity,
              _id: doc._id,
              request: {
                type: "GET",
                url: `${process.env.DOMAIN}/orders/${doc._id}`,
              },
            };
          }),
        };
        res.status(200).json(response);
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({ error });
      });
  };

  getById = (req, res) => {
    const id = req.params.orderId;
    Order.findById(id)
      .select("productId quantity")
      .populate("productId", "name")
      .exec()
      .then((order) => {
        console.log(order);

        if (order) {
          res.status(200).json({
            order,
            request: {
              type: "GET",
              url: `${process.env.DOMAIN}/orders`,
            },
          });
        } else {
          res.status(404).json({ message: "No valid entry found for provided ID" });
        }
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({ error });
      });
  };

  addOrder = async (req, res) => {
    const { productId, quantity } = req.body;

    const existingProduct = await Product.findById(productId);

    if (!existingProduct) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const order = new Order({
      productId,
      quantity,
    });

    order
      .save()
      .then((response) => {
        console.log(response);
        res.status(201).json({
          orders: "Created order successfully",
          createdProduct: {
            productId: response.productId,
            quantity: response.quantity,
            _id: response._id,
            request: {
              type: "GET",
              url: `${process.env.DOMAIN}/orders/${response._id}`,
            },
          },
        });
      })
      .catch((erorr) => {
        console.log(erorr);
        res.status(500).json({
          erorr,
        });
      });
  };

  editById = (req, res) => {
    const _id = req.params.orderId;
    Order.updateOne(
      {
        _id,
      },
      { $set: req.body }
    )
      .exec()
      .then((result) => {
        console.log("result", result);
        res.status(200).json({
          message: "Updated order!",
          request: {
            type: "GET",
            url: `${process.env.DOMAIN}/orders/${_id}`,
          },
        });
      })
      .catch((error) => {
        console.log("error", error);
        res.status(500).json(error);
      });
  };

  deleteById = (req, res) => {
    const _id = req.params.orderId;

    Order.deleteOne({ _id })
      .exec()
      .then((result) => {
        res.status(200).json({
          message: "Order Deleted",
          result,
          request: {
            type: "POST",
            url: `${process.env.DOMAIN}/orders`,
            data: { productId: "Id", quantity: "Number" },
          },
        });
      })
      .catch((error) => {
        console.log(" ~ error", error);
        res.status(500).json(error);
      });
  };

  deleteByIds = async (req, res) => {
    try {
      const _id = await JSON.parse(req.params.orderId)?.map((id) => mongoose.Types.ObjectId(id));
      await Order.deleteMany({ _id: { $in: _id } })
        .exec()
        .then((result) => {
          res.status(200).json({
            result,
            message: "Order Deleted",
            request: {
              type: "POST",
              url: `${process.env.DOMAIN}/orders`,
              data: { productId: "Id", quantity: "Number" },
            },
          });
        })
        .catch((error) => {
          console.log(" ~ error", error);
          res.status(500).json(error);
        });
    } catch (error) {
      let err;
      switch (error?.message) {
        case "Argument passed in must be a string of 12 bytes or a string of 24 hex characters or an integer":
          err = "OrderIds not valid";
          break;

        default:
          err = error?.message;
          break;
      }

      res.status(500).json({ message: err || "something goes wrong" });
    }
  };

  deleteOrders = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.orderId)) {
      this.deleteByIds(req, res);
    } else {
      this.deleteById(req, res);
    }
  };
}

module.exports = new Orders();
