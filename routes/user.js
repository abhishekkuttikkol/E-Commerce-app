const { response } = require("express");
var express = require("express");
const session = require("express-session");
var router = express.Router();
var productHelper = require("../helpers/product-helpers");
var userHelper = require("../helpers/user-helpers");

const verifyLogin = (req, res, next) => {
  if (req.session.loggedIn) {
    next();
  } else {
    res.redirect("/login");
  }
};

/* GET home page. */
router.get("/", function (req, res, next) {
  let user = req.session.user;
  console.log(user);
  productHelper.getAllProducts().then((products) => {
    res.render("user/view-products", { products, admin: false, user });
  });
});

router.get("/login", function (req, res, next) {
  if (req.session.loggedIn) {
    res.redirect("/");
  } else {
    res.render("user/login", { logginError: req.session.logginError });
    req.session.logginError = false;
  }
});
router.post("/login", function (req, res, next) {
  userHelper.doLogin(req.body).then((response) => {
    if (response.status) {
      req.session.loggedIn = true;
      req.session.user = response.user;
      res.redirect("/");
    } else {
      req.session.logginError = true;
      res.redirect("/login");
    }
  });
});

router.get("/logout", function (req, res) {
  req.session.destroy();
  res.redirect("/");
});

router.get("/signup", function (req, res, next) {
  res.render("user/signup");
});
router.post("/signup", function (req, res, next) {
  userHelper.doSignup(req.body).then((response) => {
    console.log(response);
    req.session.loggedIn=true
    // req.session.user=response
    res.redirect('/')
  });
});

router.get("/cart", verifyLogin, function (req, res) {
  res.render("user/cart");
});

module.exports = router;
