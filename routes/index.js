var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home' });
});

router.get("/register", function(req, res, next) {
  res.render("register", {title: "Register"});
})

router.get("/login", function(req, res, next) {
  res.render("login", {title: "Login"});
})

router.get("/change-password", function(req, res, next) {
  res.render("change-password", {title: "Change password"});
})

module.exports = router;
