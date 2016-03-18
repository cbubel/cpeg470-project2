var CryptoJS = require("crypto-js");

var Hasher = function() {
  var MAX = 60000;
  var MIN = 40000;

  var salt = function() {
    var digest = CryptoJS.enc.Utf8.parse(CryptoJS.lib.WordArray.random(32));
    return CryptoJS.SHA512(digest).toString();
  }

  var stretch = function() {
    return Math.floor(Math.random() * (MAX - MIN + 1)) + MIN;
  }

  this.hash = function(password, salt, n) {
    var hashed = CryptoJS.enc.Utf8.parse('0');
    var psalt = CryptoJS.enc.Utf8.parse(password + salt);

    for (var i = 0; i < n; i++) {
      hashed = CryptoJS.SHA256(hashed.concat(psalt));
    }

    return hashed.toString();
  }

  // Returns object of salt, stretch, superHash
  this.superHash = function(password) {
    var salted = salt();
    var stretched = stretch();
    var superHashed = this.hash(password, salted, stretched);

    var res = {
      salt: salted,
      stretch: stretched,
      hash: superHashed
    };

    return res;
  }
}

module.exports = Hasher;
