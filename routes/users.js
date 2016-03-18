var express = require('express');
var router = express.Router();
var CryptoRef = require("../crypto");
var Crypto = new CryptoRef();
var HasherRef = require("../hasher");
var Hasher = new HasherRef();
var MongoClient = require('mongodb').MongoClient;
// MongoClient.connect("mongodb://localhost:27017/data", function(err, db) {
//   if(err) { return console.dir(err); }
//   var users = db.collection('users');
//
//   users.find().toArray(function(err, items) {
//     console.log(items);
//   });
//
// });


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// Create new user
// body = {email: "", password: ""}
router.post('/', function(req, res, next) {
  var email = req.body.email;
  var password = req.body.password;
  var hash_package = Hasher.superHash(password);
  var salt = hash_package.salt;
  var stretch = hash_package.stretch;
  var hash = hash_package.hash;

  MongoClient.connect("mongodb://localhost:27017/data", function(err, db) {
    if(err) { return console.dir(err); }

    var users = db.collection('users');
    var key = {'email': email};
    var new_user = {
      email: email,
      salt: salt,
      stretch: stretch,
      hash: hash
    };

    users.findOne(key, function(err, item) {
      if(item === null) {
        users.insert(new_user, {w:1}, function(err, result) {
          if(err) {
            res.status(500).send(error);
          }
          else {
            Crypto.generateKeypair(email, function(package) {
              res.status(200).send(package)
            });
          }
        });
      }
      else {
        res.status(400).send("User already exists");
      }
    });
  });
});

router.post('/login', function(req, res, next) {
  var email = req.body.email;
  var password = req.body.password;

  // TODO: Hash password and check user in database

  Crypto.generateKeypair(email, function(package) {
    res.send(package)
  });
});


module.exports = router;
