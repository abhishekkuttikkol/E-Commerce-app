const { response } = require("express");
var express = require("express");
var router = express.Router();
var productHelper = require("../helpers/product-helpers");

/* GET users listing. */
router.get("/", function (req, res, next) {
  productHelper.getAllProducts().then((products) => {
    console.log(products);
    res.render("admin/view-products", { products, admin: true });
  });
});

router.get("/add-product", function (req, res) {
  res.render("admin/add-product");
});
router.post("/add-product", (req, res) => {
  console.log(req.body);
  console.log(req.files.image);
  productHelper.addProduct(req.body, (id) => {
    let image = req.files.image;
    image.mv("./public/product-images/" + id + ".jpg", (err, done) => {
      if (!err) {
        res.redirect('/admin')
      } else {
        console.log(err);
      }
    });
  });
});

router.get("/delete-product/:id", function (req, res) {
  let productId = req.params.id;
  productHelper.deleteProduct(productId).then((response) => {
    res.redirect("/admin");
  });
});

router.get("/edit-product/:id", async (req, res) => {
  let product = await productHelper.getProductDetails(req.params.id);
  console.log(product);
  res.render("admin/edit-product", { product });
});

router.post("/edit-product/:id", (req, res) => {
  productHelper.updateProduct(req.params.id, req.body).then(() => {
    let id = req.params.id
    let image = req.files.image;
    image.mv("./public/product-images/" + id + ".jpg")
    res.redirect("/admin");
  });
});

module.exports = router;
