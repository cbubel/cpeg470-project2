var jwcrypto = require("browserid-crypto");
require("browserid-crypto/lib/algs/ds");

var Crypto = function() {
  this.generateKeypair = function(email, resultCallback) {
    jwcrypto.generateKeypair({
      algorithm: "DSA",
      keysize: 160
    }, function(err, keypair) {
      var publicKeyToCertify = keypair.publicKey.serialize();
      var payload = {
        principal: {email: email},
        pubkey: jwcrypto.loadPublicKey(publicKeyToCertify)
      };
      jwcrypto.sign(payload, keypair.secretKey, function(err, jws) {
        var signedObject = jws;
        var publicKey = keypair.publicKey.serialize();

        var res = {
          signedObject: signedObject,
          publicKey: publicKey
        };

        resultCallback(res);
      });
    });
  }
  this.verify = function(package, resultCallback) {
    var signedObject = package.signedObject;
    var publicKey = jwcrypto.loadPublicKey(package.publicKey);
    jwcrypto.verify(signedObject, publicKey, function(err, payload) {
      if(err === null) resultCallback(true);
      else return resultCallback(false);
    });
  }
}

module.exports = Crypto;
