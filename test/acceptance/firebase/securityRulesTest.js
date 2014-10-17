'use strict';

var fs = require('fs'),
    firebase = require('firebase'),
    firebaseTokenGenerator = require('firebase-token-generator');

var FIREBASE_URL = 'https://simap.firebaseio.com';
var PERMISSION_DENIED = /PERMISSION_DENIED/;

var secret = JSON.parse(fs.readFileSync('/Users/drautb/.firebases/simap')).token;
var tokenGenerator = new firebaseTokenGenerator(secret);

var testUserA = {
  uid: 'test:123',
  provider: 'test',
  provider_uid: '123',
  display_name: 'drautb-test-a'
};

var testUserB = {
  uid: 'test:456',
  provider: 'test',
  provider_uid: '456',
  display_name: 'drautb-test-b'
};

var productionRef  = new firebase(FIREBASE_URL); 

function authUser(user, cb) {
  var token = tokenGenerator.createToken(user);
  productionRef.authWithCustomToken(token, cb); 
}

function authAdmin(cb) {
  var token = tokenGenerator.createToken({uid: 'admin'}, {admin: true});
  productionRef.authWithCustomToken(token, cb); 
}

function ignored() {}

authUser(testUserB, function(error) {
  if (error) {
    console.error('ERROR: ', error);
  }

  productionRef.child('/user/' + testUserB.uid).set(testUserB);
});

describe('Firebase Security Rules', function() {

  describe('overall test setup', function() {

    it('should let testUserA register', function(done) {
      authUser(testUserA, function(error) {
        expect(error).toBe(null);
        productionRef.child('/user/' + testUserA.uid).set(testUserA, function(error) {
          expect(error).toBe(null);
          done();
        });
      });
    });

    it('should let testUserB register', function(done) {
      authUser(testUserB, function(error) {
        expect(error).toBe(null);
        productionRef.child('/user/' + testUserB.uid).set(testUserB, function(error) {
          expect(error).toBe(null);
          done();
        });
      });
    });

  });

  describe('user objects', function() {

    describe('user modification', function() {

      beforeEach(function(done) {
        authUser(testUserA, function(error) {
          expect(error).toBe(null);
          done();
        });
      });

      it('should allow anyone to change their display_name', function(done) {
        productionRef.child('/user/' + testUserA.uid).update({display_name: 'new-display-name'}, function(error) {
          expect(error).toBe(null);
          done();
        });
      });

      it('should not allow anyone to use an empty display_name', function(done) {
        productionRef.child('/user/' + testUserA.uid).update({display_name: ''}, function(error) {
          expect(error).toMatch(PERMISSION_DENIED);
          done();
        });
      });

      it('should not allow anyone to delete their display_name', function(done) {
        productionRef.child('/user/' + testUserA.uid).update({display_name: null}, function(error) {
          expect(error).toMatch(PERMISSION_DENIED);
          done();
        });
      });

      it('should not allow anyone to change their uid', function(done) {
        productionRef.child('/user/' + testUserA.uid).update({uid: 'new-uid'}, function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });

      it('should not allow anyone to delete their uid', function(done) {
        productionRef.child('/user/' + testUserA.uid).update({uid: null}, function(error) {
          expect(error).toMatch(PERMISSION_DENIED);
          done();
        });
      });

      it('should not allow anyone to change their provider', function(done) {
        productionRef.child('/user/' + testUserA.uid).update({provider: 'new-provider'}, function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });

      it('should not allow anyone to delete their provider', function(done) {
        productionRef.child('/user/' + testUserA.uid).update({provider: null}, function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });

      it('should not allow anyone to change their provider_uid', function(done) {
        productionRef.child('/user/' + testUserA.uid).update({provider_uid: 'new-provider-uid'}, function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });

      it('should not allow anyone to delete their provider_uid', function(done) {
        productionRef.child('/user/' + testUserA.uid).update({provider_uid: null}, function(error) {
          expect(error).toMatch(PERMISSION_DENIED);
          done();
        });
      });

      it('should not allow a user to read another users data', function(done) {
        productionRef.child('/user/' + testUserB.uid).once('value', ignored, function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });

    });

    describe('invalid user objects', function() {

      var bogusUser;

      beforeEach(function(done) {
        bogusUser = {
          uid: 'test:789',
          provider: 'test',
          provider_uid: '789',
          display_name: 'bogus-man'
        };

        authUser(bogusUser, function(error) {
          expect(error).toBe(null);
          done();
        });
      });

      it('should not let a user register whose uid is different than their key', function(done) {
        bogusUser.uid = 'modified-uid';
        productionRef.child('/user/' + bogusUser.uid).set(bogusUser, function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });

      it('should not let a user register whose provider is absent from the uid', function(done) {
        bogusUser.provider = 'blah';
        productionRef.child('/user/' + bogusUser.uid).set(bogusUser, function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });

      it('should not let a user register whose provider_uid is absent from the uid', function(done) {
        bogusUser.provider_uid = 'blah';
        productionRef.child('/user/' + bogusUser.uid).set(bogusUser, function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });

    });

  });

  describe('overall test cleanup', function() {

    it('should cleanup the test users', function(done) {
      authAdmin(function(error) {
        expect(error).toBe(null);
        productionRef.child('/user/' + testUserA.uid).remove(function(error) {
          expect(error).toBe(null);
          productionRef.child('/user/' + testUserB.uid).remove(function(error) {
            expect(error).toBe(null);
            done();
          });
        });
      });
    });

  });

});
