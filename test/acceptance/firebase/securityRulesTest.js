'use strict';

/**
 * I want to change this.
 *
 * Execute the tests against simpa-test, not simap.
 * Automatically update the security rules before running the acceptance tests.
 * http://stackoverflow.com/questions/14590788/updating-security-rules-through-rest-api
 *
 * Create framework so that I can specify the state of the firebase, then swtich
 * to an authed user, and test things.
 */

var fs = require('fs'),
    firebase = require('firebase'),
    firebaseTokenGenerator = require('firebase-token-generator');

var TARGET = 'simap-test',
    FIREBASE_URL = 'https://' + TARGET + '.firebaseio.com',
    PERMISSION_DENIED = /PERMISSION_DENIED/;

var secret = JSON.parse(fs.readFileSync('/Users/drautb/.firebases/' + TARGET)).token,
    tokenGenerator = new firebaseTokenGenerator(secret);

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

var testRef  = new firebase(FIREBASE_URL); 

function authUser(user, cb) {
  var token = tokenGenerator.createToken(user);
  testRef.authWithCustomToken(token, cb); 
}

function authAdmin(cb) {
  var token = tokenGenerator.createToken({uid: 'admin'}, {admin: true});
  testRef.authWithCustomToken(token, cb); 
}

function ignored() {}

function setFirebaseState(state, cb) {
  authAdmin(function(error) {
    if (error) {
      console.log('ERROR AUTHENTICATING AS ADMIN: ', error);
    }
    testRef.set({}, function(error) {
      if (error) {
        console.log('ERROR CLEARING FIREBASE: ', error);
      }
      testRef.set(state, function(error) {
        if (error) {
          console.log('ERROR SETTING FIREBASE STATE: ', error);
        }
        cb(); 
      });
    });
  });
}

describe('Firebase Security Rules', function() {

  var originalTimeout = null;

  beforeEach(function() {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
  });

  afterEach(function() {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });

  describe('overall test setup', function() {

    it('should let testUserA register', function(done) {
      authUser(testUserA, function(error) {
        expect(error).toBe(null);
        testRef.child('/user/' + testUserA.uid).set(testUserA, function(error) {
          expect(error).toBe(null);
          done();
        });
      });
    });

    it('should let testUserB register', function(done) {
      authUser(testUserB, function(error) {
        expect(error).toBe(null);
        testRef.child('/user/' + testUserB.uid).set(testUserB, function(error) {
          expect(error).toBe(null);
          done();
        });
      });
    });

  });

  describe('users', function() {

    describe('user modification', function() {

      beforeEach(function(done) {
        authUser(testUserA, function(error) {
          expect(error).toBe(null);
          done();
        });
      });

      it('should allow anyone to change their display_name', function(done) {
        testRef.child('/user/' + testUserA.uid).update({display_name: 'new-display-name'}, function(error) {
          expect(error).toBe(null);
          done();
        });
      });

      it('should not allow anyone to use an empty display_name', function(done) {
        testRef.child('/user/' + testUserA.uid).update({display_name: ''}, function(error) {
          expect(error).toMatch(PERMISSION_DENIED);
          done();
        });
      });

      it('should not allow anyone to delete their display_name', function(done) {
        testRef.child('/user/' + testUserA.uid).update({display_name: null}, function(error) {
          expect(error).toMatch(PERMISSION_DENIED);
          done();
        });
      });

      it('should not allow anyone to change their uid', function(done) {
        testRef.child('/user/' + testUserA.uid).update({uid: 'new-uid'}, function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });

      it('should not allow anyone to delete their uid', function(done) {
        testRef.child('/user/' + testUserA.uid).update({uid: null}, function(error) {
          expect(error).toMatch(PERMISSION_DENIED);
          done();
        });
      });

      it('should not allow anyone to change their provider', function(done) {
        testRef.child('/user/' + testUserA.uid).update({provider: 'new-provider'}, function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });

      it('should not allow anyone to delete their provider', function(done) {
        testRef.child('/user/' + testUserA.uid).update({provider: null}, function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });

      it('should not allow anyone to change their provider_uid', function(done) {
        testRef.child('/user/' + testUserA.uid).update({provider_uid: 'new-provider-uid'}, function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });

      it('should not allow anyone to delete their provider_uid', function(done) {
        testRef.child('/user/' + testUserA.uid).update({provider_uid: null}, function(error) {
          expect(error).toMatch(PERMISSION_DENIED);
          done();
        });
      });

      it('should not allow a user to read another users data', function(done) {
        testRef.child('/user/' + testUserB.uid).once('value', ignored, function(error) {
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
        testRef.child('/user/' + bogusUser.uid).set(bogusUser, function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });

      it('should not let a user register whose provider is absent from the uid', function(done) {
        bogusUser.provider = 'blah';
        testRef.child('/user/' + bogusUser.uid).set(bogusUser, function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });

      it('should not let a user register whose provider_uid is absent from the uid', function(done) {
        bogusUser.provider_uid = 'blah';
        testRef.child('/user/' + bogusUser.uid).set(bogusUser, function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });

    });

  });

  describe('categories', function() {

    var newCategoryId, newCategory;

    beforeEach(function(done) {
      newCategoryId = 'lksaj2flkjfe2';
      newCategory = {
        owner: testUserA.uid,
        name: 'new category name',
        color: 'afafaf'
      };

      authUser(testUserA, function(error) {
        expect(error).toBe(null);
        done();
      });
    });

    describe('allowed operations', function() {

      it('should allow a user to create a category', function(done) {
        testRef.child('/category/' + newCategoryId).set(newCategory, function(error) {
          expect(error).toBe(null);
          done();
        });
      });

      it('should allow a user to change a category name', function(done) {
        newCategory.name = 'updated name';
        testRef.child('/category/' + newCategoryId).update(newCategory, function(error) {
          expect(error).toBe(null);
          done();
        });
      });

      it('should allow a user to change a category color', function(done) {
        newCategory.color = 'bbbbff';
        testRef.child('/category/' + newCategoryId).update(newCategory, function(error) {
          expect(error).toBe(null);
          done();
        });
      });

      it('should allow a user to delete their categories', function(done) {
        testRef.child('/category/' + newCategoryId).remove(function(error) {
          expect(error).toBe(null);
          done();
        });
      });

    });

    describe('disallowed operations', function() {

      it('should not allow a user to create a category that they don\'t own', function(done) {
        newCategory.owner = 'another:uid';
        testRef.child('/category/' + newCategoryId).set(newCategory, function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });

      it('should not allow a user to create a category with an empty name', function(done) {
        newCategory.name = '';
        testRef.child('/category/' + newCategoryId).set(newCategory, function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });

      it('should not allow a user to create a category with a name longer than 48 chars', function(done) {
        newCategory.name = '1234567890123456789012345678901234567890123456789';
        testRef.child('/category/' + newCategoryId).set(newCategory, function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });

      it('should not allow a user to create a category with an empty color string', function(done) {
        newCategory.color = '';
        testRef.child('/category/' + newCategoryId).set(newCategory, function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });

      it('should not allow a user to create a category with a color longer than 6 chars', function(done) {
        newCategory.color = 'ffffffa';
        testRef.child('/category/' + newCategoryId).set(newCategory, function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });

      it('should not allow a user to create a category with a color that contains non-hex chars', function(done) {
        newCategory.color = 'ffffgg';
        testRef.child('/category/' + newCategoryId).set(newCategory, function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });

    });

    describe('access policy', function() {

      var state;

      beforeEach(function(done) {

        state = {
          user: {},
          category: {
            'cid1': {
              owner: testUserB.uid,
              name: 'some category name',
              color: 'ffffff'
            }
          }
        };

        state.user[testUserA.uid] = testUserA;
        state.user[testUserB.uid] = testUserB;

        setFirebaseState(state, function() {
          authUser(testUserA, function() {
            done();
          });
        });

      });

      it('should not allow a user to read a category that they don\'t own', function(done) {
        testRef.child('/category/cid1').once('value', ignored, function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });

      it('should not allow a user to modify a category that they don\'t own', function(done) {
        testRef.child('/category/cid1').update({name: 'new-name'}, function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });

      it('should not allow a user to delete a category that they don\'t own', function(done) {
        testRef.child('/category/cid1').remove(function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });

    });

  });
  
  describe('families', function() {
    var newFamilyId, newFamily;

    beforeEach(function(done) {
      newFamilyId = 'lksaj2flkjfe2';
      newFamily = {
        owner: testUserA.uid,
        adults: 2,
        children: 1
      };

      authUser(testUserA, function(error) {
        expect(error).toBe(null);
        done();
      });
    });

    describe('allowed operations', function() {
      it('should allow a user to create a family', function(done) {
        testRef.child('/family/' + newFamilyId).set(newFamily, function(error) {
          expect(error).toBe(null);
          done();
        });
      });

      it ('should allow a user to change the number of adults in their family', function(error) {
        newFamily.adults = 4;
        testRef.child('/family/' + newFamilyId).update(newFamily, function(error) {
          expect(error).toBe(null);
          done();
        });
      });

      it('should allow a user to chnage the number of children in their family', function(error) {
        newFamily.children = 5;
        testRef.child('/family/', + newFamilyId).update(newFamily, function(error) {
          expect(error).toBe(null);
          done();
        });
      });
    });

    describe('disallowed operations', function() {
      it('should not allow a user to delete their family', function(done) {
        testRef.child('/family/' + newFamilyId).remove(function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });

      it('should not allow a user to put in a negative number of adults', function(done) {
        newFamily.adults = -1;
        testRef.child('/family/' + newFamilyId).update(newFamily, function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });

      it('should not allow a user to put in a negative number of children', function(done) {
        newFamily.children = -1;
        testRef.child('/family/' + newFamilyId).update(newFamily, function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });
    });

    describe('access policy', function() {
      var state;

      beforeEach(function(done) {
        state = {
          user: {},
          family: {
            'fid1': {
              owner: testUserB.uid,
              adults: 2,
              children: 1
            }
          }
        };

        state.user[testUserA.uid] = testUserA;
        state.user[testUserB.uid] = testUserB;

        setFirebaseState(state, function() {
          authUser(testUserA, function() {
            done();
          });
        });
      });

      it('should not allow a user to read anyone else\'s family', function(done) {
        testRef.child('/family/fid1').once('value', ignored, function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });

      it('should not allow a user to modify anyone else\'s family', function(done) {
        testRef.child('/family/fid1').update({adults: 1}, function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });

      it('should not allow a user to delete anyone\'s family', function(done) {
        testRef.child('/family/fid1').remove(function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });
    });
  });

  describe('goals', function() {
    var newGoalId, newGoal;

    beforeEach(function(done) {
      newGoalId = 'lksaj2flkjfe2';
      newGoal = {
        owner: testUserA.uid,
        days: 90
      };

      authUser(testUserA, function(error) {
        expect(error).toBe(null);
        done();
      });
    });

    describe('allowed operations', function() {
      it('should allow a user to create a goal', function(done) {
        testRef.child('/goal/' + newGoalId).set(newGoal, function(error) {
          expect(error).toBe(null);
          done();
        });
      });

      it('should allow a user to change the days on their goal', function(done) {
        testRef.child('/goal/' + newGoalId).update(newGoal, function(error) {
          expect(error).toBe(null);
          done();
        });
      });
    });

    describe('disallowed operations', function() {
      it('should not allow a user to delete their goal', function(done) {
        testRef.child('/goal/' + newGoalId).remove(function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });

      it('should not allow a user to use a number < 1 for days', function(done) {
        newGoal.days = 0;
        testRef.child('/goal/' + newGoalId).update(newGoal, function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });
    });

    describe('access policy', function() {
      var state;

      beforeEach(function(done) {
        state = {
          user: {},
          family: {
            'gid1': {
              owner: testUserB.uid,
              days: 365
            }
          }
        };

        state.user[testUserA.uid] = testUserA;
        state.user[testUserB.uid] = testUserB;

        setFirebaseState(state, function() {
          authUser(testUserA, function() {
            done();
          });
        });
      });

      it('should not allow a user to read anyone else\'s goal', function(done) {
        testRef.child('/goal/gid1').once('value', ignored, function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });

      it('should not allow a user to change anyone else\'s goal', function(done) {
        testRef.child('/goal/gid1').update({days: 1}, function(error) {
          expect(error.code).toBe(null);
          done();
        });
      });

      it('should not allow a user to delete anyone\'s goal', function(done) {
        testRef.child('/goal/gid1').remove(function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });
    });
  });

  describe('items', function() {

    describe('allowed operations', function() {
      it('should allow a user to create an item', function(done) {
        // TODO
        done();
      });

      it('should allow a user to change the name of their items', function(done) {
        // TODO
        done();
      });

      it('should allow a user to change the color of their items', function(done) {
        // TODO
        done();
      });

      it('should allow a user to change the category of their items', function(done) {
        // TODO
        done();
      });

      it('should allow a user to change the amount of their items', function(done) {
        // TODO
        done();
      });

      it('should allow a user to change the storage plan for their items', function(done) {
        // TODO
        done();
      });

      it('should allow a user to add units to their items', function(done) {
        // TODO
        done();
      });

      it('should allow a user to remove units from their items', function(done) {
        // TODO
        done();
      });

      it('should allow a user to change the primary unit for their items', function(done) {
        // TODO
        done();
      });

      it('should allow a user to delete an item', function(done) {
        // TODO
        done();
      });
    });

    describe('disallowed operations', function() {
      it('should not allow a user to change the owner of their items', function(done) {
        // TODO
        done();
      });

      it('should not allow items to have an empty name', function(done) {
        // TODO
        done();
      });

      it('should not allow items to have names longer than 48 characters', function(done) {
        // TODO
        done();
      });

      it('should not allow items to have empty color strings', function(done) {
        // TODO
        done();
      });

      it('should not allow items to have color strings longer than 6 characters', function(done) {
        // TODO
        done();
      });

      it('should not allow items to have color strings with non-hexadecimal digits', function(done) {
        // TODO
        done();
      });

      it('should not allow an item to not have a category', function(done) {
        // TODO
        done();
      });

      it('should not allow an item to have a category that the user does not own', function(done) {
        // TODO
        done();
      });

      it('should not allow an item to have a negative amount', function(done) {
        // TODO
        done();
      });

      it('should not allow an item to not have a storage plan', function(done) {
        // TODO
        done();
      });

      it('should not allow an item to have a storage plan that the user does not own', function(done) {
        // TODO
        done();
      });

      it('should not allow a user to remove the last unit from their items', function(done) {
        // TODO
        done();
      });

      it('should not allow an item to not have a primary unit', function(done) {
        // TODO
        done();
      });

      it('should not allow an item to have a primary unit that the user does not own', function(done) {
        // TODO
        done();
      });
    });

    describe('access policy', function() {

    });

  });

  describe('overall test cleanup', function() {

    it('should clear out the firebase', function(done) {
      setFirebaseState({}, function() {
        done();
      });
    });

  });

});
