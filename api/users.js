var express = require('express');
var router = express.Router();
var CryptoRef = require("../crypto");
var Crypto = new CryptoRef();
var HasherRef = require("../hasher");
var Hasher = new HasherRef();
var MongoClient = require('mongodb').MongoClient;

MongoClient.connect("mongodb://localhost:27017/data", function(err, db) {
  if(err) { return console.dir(err); }
  var users = db.collection('users');

  users.find().toArray(function(err, items) {
    console.log(items);
  });

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
    var key = {"email": email};
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

// Login
// body = {email: "", password: ""}
router.post('/login', function(req, res, next) {
  var email = req.body.email;
  var password = req.body.password;
  var key = {"email": email};

  MongoClient.connect("mongodb://localhost:27017/data", function(err, db) {
    if(err) { return console.dir(err); }

    var users = db.collection('users');
    users.findOne(key, function(err, item) {
      if(item === null) {
        res.status(400).send("User does not exist");
      }
      else {
        var hash = item.hash;
        var salt = item.salt;
        var stretch = item.stretch;
        var input_pwd_hashed = Hasher.hash(password, salt, stretch);

        if(input_pwd_hashed === hash) {
          Crypto.generateKeypair(email, function(package) {
            res.status(200).send(package);
          });
        }
        else {
          res.status(400).send("Incorrect password");
        }
      }
    });
  });
});

// Change password
// body = {email: "", current_password: "", new_password: ""}
router.post('/change-password', function(req, res, next) {
  var token = req.body.token;
  var email = req.body.email;
  var current_password = req.body.current_password;
  var new_password = req.body.new_password;
  var key = {"email": email};

  Crypto.verify(token, function(isValid) {
    if(isValid) {
      MongoClient.connect("mongodb://localhost:27017/data", function(err, db) {
        if(err) { return console.dir(err); }

        var users = db.collection('users');
        users.findOne(key, function(err, item) {
          if(item === null) {
            res.status(400).send("User does not exist");
          }
          else {
            var hash = item.hash;
            var salt = item.salt;
            var stretch = item.stretch;
            var input_pwd_hashed = Hasher.hash(current_password, salt, stretch);

            if(input_pwd_hashed === hash) {
              var new_hash_package = Hasher.superHash(new_password);
              var new_salt = new_hash_package.salt;
              var new_stretch = new_hash_package.stretch;
              var new_hash = new_hash_package.hash;
              var new_pwd_package = {
                salt: new_salt,
                stretch: new_stretch,
                hash: new_hash
              };
              users.update(key, {$set: new_pwd_package}, {w:1}, function(err, result) {
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
              res.status(400).send("Incorrect password");
            }
          }
        });
      });
    }
    else {
      res.status(400).send("Invalid token");
    }
  });
});

module.exports = router;
