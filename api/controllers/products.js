const Product = require("../../models/product");

class Products {
  getAll = (req, res) => {
    Product.find()
      .select("name price productImage")
      .exec()
      .then((docs) => {
        const response = {
          count: docs.length,
          products: docs.map((doc) => {
            return {
              name: doc.name,
              price: doc.price,
              productImage: doc.productImage,
              _id: doc._id,
              request: {
                type: "GET",
                url: `${process.env.DOMAIN}/products/${doc._id}`,
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
    const id = req.params.pId;
    Product.findById(id)
      .select("name price productImage")
      .exec()
      .then((doc) => {
        console.log(doc);

        if (doc) {
          res.status(200).json({
            product: doc,
            request: {
              type: "GET",
              url: `${process.env.DOMAIN}/products`,
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

  addProduct = (req, res) => {
    const { name, price } = req.body;
    const product = new Product({
      name,
      price,
      productImage: req.file.path,
    });

    product
      .save()
      .then((response) => {
        console.log(response);
        res.status(201).json({
          products: "Created product successfully",
          createdProduct: {
            name: response.name,
            price: response.price,
            productImage: response.productImage,
            _id: response._id,
            request: {
              type: "GET",
              url: `${process.env.DOMAIN}/products/${response._id}`,
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
    const _id = req.params.pId;
    Product.updateOne(
      {
        _id,
      },
      { $set: req.body }
    )
      .exec()
      .then((result) => {
        console.log(" ~ x~ result", result);
        res.status(200).json({
          message: "Updated product!",
          request: {
            type: "GET",
            url: `${process.env.DOMAIN}/products/${_id}`,
          },
        });
      })
      .catch((error) => {
        console.log(" ~ error", error);
        res.status(500).json(error);
      });
  };

  deleteById = (req, res) => {
    const _id = req.params.pId;
    Product.deleteOne({ _id })
      .exec()
      .then((result) => {
        res.status(200).json({
          message: "Product Deleted",
          request: {
            type: "POST",
            url: `${process.env.DOMAIN}/products`,
            data: { name: "String", price: "Number" },
          },
        });
      })
      .catch((error) => {
        console.log(" ~ error", error);
        res.status(500).json(error);
      });
  };
}

module.exports = new Products();
