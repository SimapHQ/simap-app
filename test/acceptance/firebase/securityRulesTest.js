'use strict';

var async = require('async'),
    fs = require('fs'),
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
  providerUid: '123',
  displayName: 'drautb-test-a'
};

var testUserB = {
  uid: 'test:456',
  provider: 'test',
  providerUid: '456',
  displayName: 'drautb-test-b'
};

var baseUserState = {};
baseUserState[testUserA.uid] = testUserA;
baseUserState[testUserB.uid] = testUserB;

var testRef  = new firebase(FIREBASE_URL);

function authUser(user, cb, authOptions) {
  if (!authOptions) {
    authOptions = {};
  }
  var token = tokenGenerator.createToken(user, authOptions);
  testRef.authWithCustomToken(token, cb);
}

function authAdmin(cb) {
  var token = tokenGenerator.createToken({uid: 'admin'}, {admin: true});
  testRef.authWithCustomToken(token, cb);
}

function ignored() {}

function setup(firebaseState, user, cb, authOptions) {
  async.series([
    function(callback) {
      authAdmin(callback);
    },
    function(callback) {
      testRef.set({}, callback);
    },
    function(callback) {
      testRef.set(firebaseState, callback);
    },
    function(callback) {
      authUser(user, callback, authOptions);
    }
  ],
  function(error, results) {
    cb(error, results);
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

  describe('user registration', function() {
    var testUser;

    beforeEach(function(done) {
      testUser = {
        uid: 'agent:007',
        provider: 'agent',
        providerUid: '007',
        displayName: 'Bond, James Bond'
      };

      setup({}, testUser, done);
    });

    it('should not let the user register whose uid is different than their key', function(done) {
      testUser.uid = 'modified-uid';
      testRef.child('/user/' + testUser.uid).set(testUser, function(error) {
        expect(error.code).toMatch(PERMISSION_DENIED);
        done();
      });
    });

    it('should not let the user register whose provider is absent from the uid', function(done) {
      testUser.provider = 'blah';
      testRef.child('/user/' + testUser.uid).set(testUser, function(error) {
        expect(error.code).toMatch(PERMISSION_DENIED);
        done();
      });
    });

    it('should not let the user register whose providerUid is absent from the uid', function(done) {
      testUser.providerUid = 'blah';
      testRef.child('/user/' + testUser.uid).set(testUser, function(error) {
        expect(error.code).toMatch(PERMISSION_DENIED);
        done();
      });
    });

    it('should allow a properly formed user to register', function(done) {
      testRef.child('/user/' + testUser.uid).set(testUser, function(error) {
        expect(error).toBe(null);
        done();
      });
    });
  });

  describe('users', function() {
    beforeEach(function(done) {
      setup({
        user: baseUserState,
        family: {
          'fid1': {
            owner: testUserA.uid,
            adults: 2,
            children: 1
          },
          'fid2': {
            owner: testUserB.uid,
            adults: 1,
            children: 0
          }
        },
        goal: {
          'gid1': {
            owner: testUserA.uid,
            months: 2,
            days: 60
          },
          'gid2': {
            owner: testUserB.uid,
            months: 12,
            days: 365
          }
        },
        category: {
          'cid1': {
            owner: testUserA.uid,
            name: 'My category',
            color: '#444333'
          },
          'cid2': {
            owner: testUserB.uid,
            name: 'Vegetables',
            color: '#ffffff'
          }
        },
        item: {
          'iid1': {
            owner: testUserA.uid,
            name: 'my-item',
            color: '#ffffff',
            amount: 0
          },
          'iid2': {
            owner: testUserB.uid,
            name: 'Potato chips',
            color: '#ffff00',
            amount: 35
          }
        }
      }, testUserA, done);
    });

    describe('uid', function() {
      it('should not allow the user to change their uid', function(done) {
        testRef.child('/user/' + testUserA.uid + '/uid').set('new-uid', function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });

      it('should not allow the user to delete their uid', function(done) {
        testRef.child('/user/' + testUserA.uid + '/uid').remove(function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });
    });

    describe('provider', function() {
      it('should not allow the user to change their provider', function(done) {
        testRef.child('/user/' + testUserA.uid + '/provider').set('new-provider', function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });

      it('should not allow the user to delete their provider', function(done) {
        testRef.child('/user/' + testUserA.uid + '/provider').remove(function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });
    });

    describe('providerUid', function() {
      it('should not allow the user to change their providerUid', function(done) {
        testRef.child('/user/' + testUserA.uid + '/providerUid').set('new-provider-uid', function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });

      it('should not allow the user to delete their providerUid', function(done) {
        testRef.child('/user/' + testUserA.uid + '/providerUid').remove(function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });
    });

    describe('displayName', function() {
      it('should allow the user to change their displayName', function(done) {
        testRef.child('/user/' + testUserA.uid + '/displayName').set('new-display-name', function(error) {
          expect(error).toBe(null);
          done();
        });
      });

      it('should not allow the user to use an empty displayName', function(done) {
        testRef.child('/user/' + testUserA.uid + '/displayName').set('', function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });

      it('should not allow the user to delete their displayName', function(done) {
        testRef.child('/user/' + testUserA.uid + '/displayName').remove(function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });
    });

    describe('family', function() {
      it('should allow the user to index their family', function(done) {
        testRef.child('/user/' + testUserA.uid + '/familyId').set('fid1', function(error) {
          expect(error).toBe(null);
          done();
        });
      });

      it('should not allow the user to index another user\'s family', function(done) {
        testRef.child('/user/' + testUserA.uid + '/familyId').set('fid2', function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });
    });

    describe('goal', function() {
      it('should allow the user to index their goal', function(done) {
        testRef.child('/user/' + testUserA.uid).update({goal: 'gid1'}, function(error) {
          expect(error).toBe(null);
          done();
        });
      });

      it('should not allow the user to index another user\'s goal', function(done) {
        testRef.child('/user/' + testUserA.uid + '/goalId').set('gid2', function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });
    });

    describe('categories', function() {
      it('should allow the user to index their categories', function(done) {
        testRef.child('/user/' + testUserA.uid + '/categories/cid1').set(true, function(error) {
          expect(error).toBe(null);
          done();
        });
      });

      it('should allow the user to remove categories from their index', function(done) {
        testRef.child('/user/' + testUserA.uid + '/categories/cid1').remove(function(error) {
          expect(error).toBe(null);
          done();
        });
      });

      it('should not allow the user to index another user\'s category', function(done) {
        testRef.child('/user/' + testUserA.uid + '/categories/cid2').set(true, function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });
    })

    describe('items', function() {
      it('should allow the user to index their items', function(done) {
        testRef.child('/user/' + testUserA.uid + '/items/iid1').set(true, function(error) {
          expect(error).toBe(null);
          done();
        });
      });

      it('should allow the user to remove items from their index', function(done) {
        testRef.child('/user/' + testUserA.uid + '/items/iid1').remove(function(error) {
          expect(error).toBe(null);
          done();
        });
      });

      it('should not allow the user to index another user\'s item', function(done) {
        testRef.child('/user/' + testUserA.uid + '/items/iid2').set(true, function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });
    });

    describe('privacy', function() {
      it('should not allow the user to read another user\'s data', function(done) {
        testRef.child('/user/' + testUserB.uid).once('value', ignored, function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });

      it('should not allow the user to modify another user\'s data', function(done) {
        testRef.child('/user/' + testUserB.uid + '/displayName').set('mine now!', function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });
    });

    describe('deletion', function() {
      it('should not allow the user to delete themselves', function(done) {
        testRef.child('/user/' + testUserA.uid).remove(function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });

      it('should not allow the user to delete another user', function(done) {
        testRef.child('/user/' + testUserB.uid).remove(function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });
    });
  });

  describe('categories', function() {
    var newCategory;

    beforeEach(function(done) {
      newCategory = {
        owner: testUserA.uid,
        name: 'new category name',
        color: '#afafaf'
      };

      setup({
        user: baseUserState,
        category: {
          'cid1': {
            owner: testUserA.uid,
            name: 'Meats',
            color: '#ff0000'
          },
          'cid2': {
            owner: testUserB.uid,
            name: 'Jellos',
            color: '#0000ff'
          }
        }
      }, testUserA, done);
    });

    describe('creation', function() {
      it('should not allow the user to create a category that belongs to another user', function(done) {
        newCategory.owner = 'not-me';
        testRef.child('/category/cid3').set(newCategory, function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });

      it('should allow the user to create a category', function(done) {
        testRef.child('/category/cid3').set(newCategory, function(error) {
          expect(error).toBe(null);
          done();
        });
      });
    });

    describe('owner', function() {
      it('should not allow the user to change the owner', function(done) {
        testRef.child('/category/cid1/owner').set(testUserB.uid, function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });

      it('should not allow the user to remove the owner', function(done) {
        testRef.child('/category/cid1/owner').remove(function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });

      it('should not allow the user to steal other user\'s categories', function(done) {
        testRef.child('/category/cid2/owner').set(testUserA.uid, function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });
    });

    describe('name', function() {
      it('should allow the user to change a category\'s name', function(done) {
        testRef.child('/category/cid1/name').set('Cereals', function(error) {
          expect(error).toBe(null);
          done();
        });
      });

      it('should not allow the user to use an empty name', function(done) {
        testRef.child('/category/cid1/name').set('', function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });

      it('should not allow the user to use a name longer than 48 characters', function(done) {
        testRef.child('/category/cid1/name').set('1234567890123456789012345678901234567890123456789', function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });
    });

    describe('color', function() {
      it('should allow the user to change a category\'s color', function(done) {
        testRef.child('/category/cid1/color').set('#ffaaff', function(error) {
          expect(error).toBe(null);
          done();
        });
      });

      it('should not allow the user to use an empty color string', function(done) {
        testRef.child('/category/cid1/color').set('', function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });

      it('should not allow the user to use a color longer than 6 letters', function(done) {
        testRef.child('/category/cid1/color').set('#ffffffa', function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });

      it('should not allow the user to use a color that contains non-hex chars', function(done) {
        testRef.child('/category/cid1/color').set('#ffffgg', function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });
    });

    describe('privacy', function() {
      it('should not allow the user to read a category that they don\'t own', function(done) {
        testRef.child('/category/cid2').once('value', ignored, function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });

      it('should not allow the user to modify a category that they don\'t own', function(done) {
        testRef.child('/category/cid2/name').set('new-name', function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });
    });

    describe('deletion', function() {
      it('should allow the user to delete their categories', function(done) {
        testRef.child('/category/cid1').remove(function(error) {
          expect(error).toBe(null);
          done();
        });
      });

      it('should not allow the user to delete a category that belongs to another user', function(done) {
        testRef.child('/category/cid2').remove(function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });
    });
  });

  describe('families', function() {
    var newFamily;

    beforeEach(function(done) {
      newFamily = {
        owner: testUserA.uid,
        adults: 2,
        children: 1
      };

      setup({
        user: baseUserState,
        family: {
          'fid1': {
            owner: testUserA.uid,
            adults: 2,
            children: 1
          },
          'fid2': {
            owner: testUserB.uid,
            adults: 2,
            children: 4
          }
        }
      }, testUserA, done);
    });

    describe('creation', function() {
      it('should not allow the user to create a family that belongs to another user', function(done) {
        newFamily.owner = 'not-me';
        testRef.child('/family/fid3').set(newFamily, function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });

      it('should allow the user to create a family', function(done) {
        testRef.child('/family/fid3').set(newFamily, function(error) {
          expect(error).toBe(null);
          done();
        });
      });
    });

    describe('owner', function() {
      it('should not allow the user to change the owner', function(done) {
        testRef.child('/family/fid1/owner').set(testUserB.uid, function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });

      it('should not allow the user to remove the owner', function(done) {
        testRef.child('/family/fid1/owner').remove(function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });

      it('should not allow the user to steal other user\'s categories', function(done) {
        testRef.child('/family/fid2/owner').set(testUserA.uid, function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });
    });

    describe('adults', function() {
      it('should allow the user to change the number of adults in their family', function(done) {
        testRef.child('/family/fid1/adults').set(4, function(error) {
          expect(error).toBe(null);
          done();
        });
      });

      it('should not allow the user to use a negative number', function(done) {
        testRef.child('/family/fid1/adults').set(-1, function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });

      it('should not allow the user to use a string', function(done) {
        testRef.child('/family/fid1/adults').set('5', function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });

      it('should not allow the user to delete their adults', function(done) {
        testRef.child('/family/fid1/adults').remove(function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });
    });

    describe('children', function() {
      it('should allow the user to change the number of children in their family', function(done) {
        testRef.child('/family/fid1/children').set(7, function(error) {
          expect(error).toBe(null);
          done();
        });
      });

      it('should not allow the user to use a negative number', function(done) {
        testRef.child('/family/fid1/children').set(-1, function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });

      it('should not allow the user to use a string', function(done) {
        testRef.child('/family/fid1/children').set('5', function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });

      it('should not allow the user to delete their children', function(done) {
        testRef.child('/family/fid1/children').remove(function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });
    });

    describe('privacy', function() {
      it('should not allow the user to read another user\'s family', function(done) {
        testRef.child('/family/fid2').once('value', ignored, function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });

      it('should not allow the user to modfiy another user\'s family', function(done) {
        testRef.child('/family/fid2/adults').set(6, function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });
    });

    describe('deletion', function() {
      it('should not allow the user to delete their family', function(done) {
        testRef.child('/family/fid1').remove(function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });

      it('should not allow the user to delete anyone\'s family', function(done) {
        testRef.child('/family/fid2').remove(function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });
    });
  });

  describe('goals', function() {
    var newGoal;

    beforeEach(function(done) {
      newGoal = {
        owner: testUserA.uid,
        months: 12,
        days: 365
      };

      setup({
        user: baseUserState,
        goal: {
          'gid1': {
            owner: testUserA.uid,
            months: 3,
            days: 90
          },
          'gid2': {
            owner: testUserB.uid,
            months: 6,
            days: 180
          }
        }
      }, testUserA, done);
    });

    describe('creation', function() {
      it('should not allow the user to create goal that belongs to another user', function(done) {
        newGoal.owner = 'not-me';
        testRef.child('/goal/gid3').set(newGoal, function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });

      it('should allow the user to create a goal', function(done) {
        testRef.child('/goal/gid3').set(newGoal, function(error) {
          expect(error).toBe(null);
          done();
        });
      });
    });

    describe('owner', function() {
      it('should not allow the user to change the owner', function(done) {
        testRef.child('/goal/gid1/owner').set(testUserB.uid, function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });

      it('should not allow the user to remove the owner', function(done) {
        testRef.child('/goal/gid1/owner').remove(function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });

      it('should not allow the user to steal other another user\'s family', function(done) {
        testRef.child('/goal/gid2/owner').set(testUserA.uid, function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });
    });

    describe('months', function() {
      it('should allow the user to their goal', function(done) {
        testRef.child('/goal/gid1/months').set(7, function(error) {
          expect(error).toBe(null);
          done();
        });
      });

      it('should not allow the user to use a number <= 0', function(done) {
        testRef.child('/goal/gid1/months').set(0, function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });

      it('should not allow the user to use a string', function(done) {
        testRef.child('/goal/gid1/months').set('5', function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });

      it('should not allow the user to delete their months', function(done) {
        testRef.child('/goal/gid1/months').remove(function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });
    });

    describe('days', function() {
      it('should allow the user to their goal', function(done) {
        testRef.child('/goal/gid1/days').set(7, function(error) {
          expect(error).toBe(null);
          done();
        });
      });

      it('should not allow the user to use a number <= 0', function(done) {
        testRef.child('/goal/gid1/days').set(0, function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });

      it('should not allow the user to use a string', function(done) {
        testRef.child('/goal/gid1/days').set('5', function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });

      it('should not allow the user to delete their days', function(done) {
        testRef.child('/goal/gid1/days').remove(function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });
    });

    describe('privacy', function() {
      it('should not allow the user to read goals that belong to another user', function(done) {
        testRef.child('/goal/gid2').once('value', ignored, function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });

      it('should not allow the user to modfiy goals that belong to another user', function(done) {
        testRef.child('/goal/gid2/days').set(6, function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });
    });

    describe('deletion', function() {
      it('should not allow the user to delete their goal', function(done) {
        testRef.child('/goal/gid1').remove(function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });

      it('should not allow the user to delete anyone\'s goal', function(done) {
        testRef.child('/goal/gid2').remove(function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });
    });
  });

  describe('items', function() {
    var newItem;

    beforeEach(function(done) {
      newItem = {
        owner: testUserA.uid,
        name: 'My new item',
        color: '#ffffff',
        categoryId: 'cid1',
        amount: 0,
        planId: 'pid1',
        units: {
          uid1: true
        },
        primaryUnitId: 'uid1'
      };

      setup({
        user: baseUserState,
        category: {
          'cid1': { owner: testUserA.uid },
          'cid2': { owner: testUserA.uid },
          'cid3': { owner: testUserB.uid }
        },
        plan: {
          'pid1': { owner: testUserA.uid },
          'pid2': { owner: testUserA.uid },
          'pid3': { owner: testUserB.uid }
        },
        unit: {
          'uid1': { owner: testUserA.uid },
          'uid2': { owner: testUserA.uid },
          'uid3': { owner: testUserB.uid }
        },
        item: {
          'iid1': {
            owner: testUserA.uid,
            name: 'My new item',
            color: '#ffffff',
            categoryId: 'cid1',
            amount: 0,
            planId: 'pid1',
            units: {
              uid1: true,
              uid2: true
            },
            primaryUnitId: 'uid1'
          },
          'iid2': {
            owner: testUserB.uid,
            name: 'My new item',
            color: '#ffffff',
            categoryId: 'cid3',
            amount: 0,
            planId: 'pid3',
            units: {
              uid3: true
            },
            primaryUnitId: 'uid3'
          }
        }
      }, testUserA, done);
    });

    describe('creation', function() {
      it('should not allow the user to create an item that belongs to another user', function(done) {
        newItem.owner = 'not-me';
        testRef.child('/item/iid3').set(newItem, function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });

      it('should allow the user to create an item', function(done) {
        testRef.child('/item/iid3').set(newItem, function(error) {
          expect(error).toBe(null);
          done();
        });
      });
    });

    describe('owner', function() {
      it('should not allow the user to change the owner', function(done) {
        testRef.child('/item/iid1/owner').set(testUserB.uid, function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });

      it('should not allow the user to remove the owner', function(done) {
        testRef.child('/item/iid1/owner').remove(function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });

      it('should not allow the user to steal other user\'s categories', function(done) {
        testRef.child('/item/iid2/owner').set(testUserA.uid, function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });
    });

    describe('name', function() {
      it('should allow the user to change the name', function(done) {
        testRef.child('/item/iid1/name').set('My other new item', function(error) {
          expect(error).toBe(null);
          done();
        });
      });

      it('should now allow the user to use an empty string', function(done) {
        testRef.child('/item/iid1/name').set('', function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });

      it('should now allow the user to use a name longer than 48 characters', function(done) {
        testRef.child('/item/iid1/name').set('1234567890123456789012345678901234567890123456789', function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });
    });

    describe('color', function() {
      it('should allow the user to change the color', function(done) {
        testRef.child('/item/iid1/color').set('#ffaaff', function(error) {
          expect(error).toBe(null);
          done();
        });
      });

      it('should not allow the user to use an empty color string', function(done) {
        testRef.child('/item/iid1/color').set('', function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });

      it('should not allow the user to use a color longer than 6 letters', function(done) {
        testRef.child('/item/iid1/color').set('#ffffffa', function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });

      it('should not allow the user to use a color that contains non-hex chars', function(done) {
        testRef.child('/item/iid1/color').set('#ffffgg', function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });
    });

    describe('categoryId', function() {
      it('should allow the user to change the category', function(done) {
        testRef.child('/item/iid1/categoryId').set('cid2', function(error) {
          expect(error).toBe(null);
          done();
        });
      });

      it('should not allow the user to remove the category', function(done) {
        testRef.child('/item/iid1/categoryId').remove(function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });

      it('should not allow the user to a category that belongs to another user', function(done) {
        testRef.child('/item/iid1/categoryId').set('cid3', function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });
    });

    describe('amount', function() {
      it('should allow the user to change the amount', function(done) {
        testRef.child('/item/iid1/amount').set(56.4, function(error) {
          expect(error).toBe(null);
          done();
        });
      });

      it('should not allow the user to use a negative amount', function(done) {
        testRef.child('/item/iid1/amount').set(-56.4, function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });
    });

    describe('planId', function() {
      it('should allow the user to change the storage plan', function(done) {
        testRef.child('/item/iid1/planId').set('pid2', function(error) {
          expect(error).toBe(null);
          done();
        });
      });

      it('should not allow the user to remove the plan', function(done) {
        testRef.child('/item/iid1/planId').remove(function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });

      it('should not allow the user to use a plan that belongs to another user', function(done) {
        testRef.child('/item/iid1/planId').set('pid3', function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });
    });

    describe('units', function() {
      it('should allow the user to add units', function(done) {
        testRef.child('/item/iid1/units/uid2').set(true, function(error) {
          expect(error).toBe(null);
          done();
        });
      });

      it('should allow the user to remove units', function(done) {
        testRef.child('/item/iid1/units/uid2').remove(function(error) {
          expect(error).toBe(null);
          done();
        });
      });

      it('should not allow the user to remove all units', function(done) {
        testRef.child('/item/iid1/units').set({}, function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });

      it('should not allow the user to use units that belong to another user', function(done) {
        testRef.child('/item/iid1/units/uid3').set(true, function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });
    });

    describe('primaryUnitId', function() {
      it('should allow the user to change the primary unit', function(done) {
        testRef.child('/item/iid1/primaryUnitId').set('uid2', function(error) {
          expect(error).toBe(null);
          done();
        });
      });

      it('should not allow the user to remove the primary unit', function(done) {
        testRef.child('/item/iid1/primaryUnitId').remove(function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });

      it('should not allow the user to use a unit that belongs to another user', function(done) {
        testRef.child('/item/iid1/primaryUnitId').set('uid3', function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });
    });

    describe('privacy', function() {
      it('should not allow the user to read items that belong to another user', function(done) {
        testRef.child('/item/iid2').once('value', ignored, function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });

      it('should not allow the user to modify items that belong to another user', function(done) {
        testRef.child('/item/iid2/name').set('stolen!', function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });
    });

    describe('deletion', function() {
      it('should allow the user to delete their own items', function(done) {
        testRef.child('/item/iid1').remove(function(error) {
          expect(error).toBe(null);
          done();
        });
      });

      it('should not allow the user to delete items that belong to another user', function(done) {
        testRef.child('/item/iid2').remove(function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });
    });
  });

  describe('units', function() {
    var newUnit;

    beforeEach(function(done) {
      newUnit = {
        owner: testUserA.uid,
        name: 'Cups'
      };

      setup({
        user: baseUserState,
        unit: {
          'unit1': {
            owner: testUserA.uid,
            name: 'Pounds'
          },
          'unit2': {
            owner: testUserB.uid,
            name: 'Oz'
          }
        }
      }, testUserA, done);
    });

    describe('creation', function() {
      it('should not allow the user to create a unit that belongs to another user', function(done) {
        newUnit.owner = 'not-me';
        testRef.child('/unit/unit3').set(newUnit, function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });

      it('should allow the user to create a unit', function(done) {
        testRef.child('/unit/unit3').set(newUnit, function(error) {
          expect(error).toBe(null);
          done();
        });
      });
    });

    describe('owner', function() {
      it('should not allow the user to change the owner', function(done) {
        testRef.child('/unit/unit1/owner').set(testUserB.uid, function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });

      it('should not allow the user to remove the owner', function(done) {
        testRef.child('/unit/unit1/owner').remove(function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });

      it('should not allow the user to steal other user\'s categories', function(done) {
        testRef.child('/unit/unit2/owner').set(testUserA.uid, function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });
    });

    describe('name', function() {
      it('should allow the user to change the name', function(done) {
        testRef.child('/unit/unit1/name').set('Boxes', function(error) {
          expect(error).toBe(null);
          done();
        });
      });

      it('should not allow the user to use an empty name', function(done) {
        testRef.child('/unit/unit1/name').set('', function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });

      it('should not allow the user to use a name longer than 16 characters', function(done) {
        testRef.child('/unit/unit1/name').set('12345678901234567', function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });
    });

    describe('privacy', function() {
      it('should not allow the user to read units that belong to another user', function(done) {
        testRef.child('/unit/unit2').once('value', ignored, function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });

      it('should not allow the user to modify units that belong to another user', function(done) {
        testRef.child('/unit/unit2/name').set('stolen!', function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });
    });

    describe('deletion', function() {
      it('should allow the user to delete their own units', function(done) {
        testRef.child('/unit/unit1').remove(function(error) {
          expect(error).toBe(null);
          done();
        });
      });

      it('should not allow the user to delete units that belong to another user', function(done) {
        testRef.child('/unit/unit2').remove(function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });
    });
  });

  describe('conversions', function() {
    var newConversion;

    beforeEach(function(done) {
      newConversion = {
        owner: testUserA.uid,
        'unit1': 16
      };

      setup({
        user: baseUserState,
        unit: {
          'unit1': {
            owner: testUserA.uid,
            name: 'Pounds'
          },
          'unit2': {
            owner: testUserA.uid,
            name: 'Oz'
          },
          'unit3': {
            owner: testUserB.uid,
            name: 'Boxes'
          },
          'unit4': {
            owner: testUserB.uid,
            name: 'Pallets'
          },
          'unit5': {
            owner: testUserA.uid,
            name: 'A new unit'
          }
        },
        conversion: {
          'unit1': {
            owner: testUserA.uid,
            'unit2': 0.0625
          },
          'unit3': {
            owner: testUserB.uid,
            'unit4': 0.03125
          }
        }
      }, testUserA, done);
    });

    describe('creation', function() {
      it('should not allow the user to create conversions that belong to another user', function(done) {
        newConversion.owner = testUserB.uid;
        testRef.child('/conversion/unit2').set(newConversion, function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });

      it('should not allow the user to create a conversion for a unit that belongs to another user', function(done) {
        testRef.child('/conversion/unit4').set(newConversion, function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });

      it('should not allow the user to create a conversion that contains units belonging to another user', function(done) {
        delete newConversion.unit1;
        newConversion['unit3'] = 500;
        testRef.child('/conversion/unit2').set(newConversion, function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });

      it('should allow the user to create a conversion', function(done) {
        testRef.child('/conversion/unit2').set(newConversion, function(error) {
          expect(error).toBe(null);
          done();
        });
      });
    });

    describe('owner', function() {
      it('should not allow the user to change the owner', function(done) {
        testRef.child('/conversion/unit1/owner').set(testUserB.uid, function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });

      it('should not allow the user to remove the owner', function(done) {
        testRef.child('/conversion/unit1/owner').remove(function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });

      it('should not allow the user to steal other user\'s categories', function(done) {
        testRef.child('/conversion/unit3/owner').set(testUserA.uid, function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });
    });

    describe('other units', function() {
      it('should allow the user to change the conversion factor', function(done) {
        testRef.child('/conversion/unit1/unit2').set(0.125, function(error) {
          expect(error).toBe(null);
          done();
        });
      });

      it('should allow the user to convert to multiple units', function(done) {
        testRef.child('/conversion/unit1/unit5').set(100, function(error) {
          expect(error).toBe(null);
          done();
        });
      });
    });

    describe('privacy', function() {
      it('should not allow the user to read conversions that belong to another user', function(done) {
        testRef.child('/conversion/unit3').once('value', ignored, function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });

      it('should not allow the user to modify conversions that belong to another user', function(done) {
        testRef.child('/conversion/unit3/unit4').set(999999, function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });
    });

    describe('deletion', function() {
      it('should allow the user to delete their own conversions', function(done) {
        testRef.child('/conversion/unit1').remove(function(error) {
          expect(error).toBe(null);
          done();
        });
      });

      it('should not allow the user to delete conversions that belong to another user', function(done) {
        testRef.child('/conversion/unit3').remove(function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });
    });
  });

  describe('plans', function() {
    var newRationPlan, newBaselinePlan;

    beforeEach(function(done) {
      newRationPlan = {
        owner: testUserA.uid,
        type: 'ration',
        adult: {
          amount: 1,
          unitId: 'unit1',
          time: 'day'
        },
        child: {
          amount: 2,
          unitId: 'unit1',
          time: 'week'
        }
      };

      newBaselinePlan = {
        owner: testUserA.uid,
        type: 'baseline',
        amount: 100,
        unitId: 'unit2'
      };

      setup({
        user: baseUserState,
        unit: {
          'unit1': {
            owner: testUserA.uid,
            name: 'Unit 1'
          },
          'unit2': {
            owner: testUserA.uid,
            name: 'Unit 2'
          },
          'unit3': {
            owner: testUserB.uid,
            name: 'Unit 3'
          }
        },
        plan: {
          'pid1': {
            owner: testUserA.uid,
            type: 'baseline',
            amount: 20,
            unitId: 'unit1'
          },
          'pid2': {
            owner: testUserA.uid,
            type: 'ration',
            adult: {
              amount: 1,
              unitId: 'unit1',
              time: 'day'
            },
            child: {
              amount: 2,
              unitId: 'unit2',
              time: 'week'
            }
          },
          'pid3': {
            owner: testUserB.uid,
            type: 'baseline',
            amount: 20,
            unitId: 'unit3'
          },
          'pid4': {
            owner: testUserB.uid,
            type: 'ration',
            adult: {
              amount: 1,
              unitId: 'unit3',
              time: 'day'
            },
            child: {
              amount: 2,
              unitId: 'unit3',
              time: 'week'
            }
          }
        }
      }, testUserA, done);
    });

    describe('creation', function() {
      it('should not allow the user to create a plan that belongs to another user', function(done) {
        newRationPlan.owner = 'not-me';
        testRef.child('/plan/pid5').set(newRationPlan, function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });

      it('should not allow the user to create a baseline plan with units that belong to another user', function(done) {
        newBaselinePlan.unitId = 'unit3';
        testRef.child('/plan/pid5').set(newBaselinePlan, function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });

      it('should not allow the user to create a rationed plan with units that belong to another user', function(done) {
        newRationPlan.adult.unitId = 'unit3';
        testRef.child('/plan/pid5').set(newRationPlan, function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });
    });

    describe('owner', function() {
      it('should not allow the user to change the owner', function(done) {
        testRef.child('/plan/pid1/owner').set(testUserB.uid, function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });

      it('should not allow the user to remove the owner', function(done) {
        testRef.child('/plan/pid1/owner').remove(function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });

      it('should not allow the user to steal other user\'s categories', function(done) {
        testRef.child('/plan/pid3/owner').set(testUserA.uid, function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });
    });

    describe('type', function() {
      it('should allow the user to change the type', function(done) {
        testRef.child('/plan/pid1/type').set('baseline', function(error) {
          expect(error).toBe(null);
          done();
        });
      });

      it('should not allow the user to use an invalid type', function(done) {
        testRef.child('/plan/pid1/type').set('invalid', function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });
    });

    describe('baseline', function() {
      it('should allow the user to change the amount', function(done) {
        testRef.child('/plan/pid1/amount').set(45, function(error) {
          expect(error).toBe(null);
          done();
        });
      });

      it('should not allow the user to use a non-postive amount', function(done) {
        testRef.child('/plan/pid1/amount').set(0, function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });

      it('should allow the user to change the unit', function(done) {
        testRef.child('/plan/pid1/unitId').set('unit2', function(error) {
          expect(error).toBe(null);
          done();
        });
      });

      it('should not allow the user to use a unit that belongs to another user', function(done) {
        testRef.child('/plan/pid1/unitId').set('unit3', function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });
    });

    describe('adult', function() {
      it('should allow the user to change the amount', function(done) {
        testRef.child('/plan/pid2/adult/amount').set(45, function(error) {
          expect(error).toBe(null);
          done();
        });
      });

      it('should not allow the user to use a non-postive amount', function(done) {
        testRef.child('/plan/pid2/adult/amount').set(0, function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });

      it('should allow the user to change the unit', function(done) {
        testRef.child('/plan/pid2/adult/unitId').set('unit2', function(error) {
          expect(error).toBe(null);
          done();
        });
      });

      it('should not allow the user to use a unit that belongs to another user', function(done) {
        testRef.child('/plan/pid2/adult/unitId').set('unit3', function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });

      it('should allow the user to change the time', function(done) {
        testRef.child('/plan/pid2/adult/time').set('year', function(error) {
          expect(error).toBe(null);
          done();
        });
      });

      it('should not allow the user to use an invalid time', function(done) {
        testRef.child('/plan/pid2/adult/time').set('eons', function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });
    });

    describe('child', function() {
      it('should allow the user to change the amount', function(done) {
        testRef.child('/plan/pid2/child/amount').set(45, function(error) {
          expect(error).toBe(null);
          done();
        });
      });

      it('should not allow the user to use a non-postive amount', function(done) {
        testRef.child('/plan/pid2/child/amount').set(0, function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });

      it('should allow the user to change the unit', function(done) {
        testRef.child('/plan/pid2/child/unitId').set('unit2', function(error) {
          expect(error).toBe(null);
          done();
        });
      });

      it('should not allow the user to use a unit that belongs to another user', function(done) {
        testRef.child('/plan/pid2/child/unitId').set('unit3', function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });

      it('should allow the user to change the time', function(done) {
        testRef.child('/plan/pid2/child/time').set('year', function(error) {
          expect(error).toBe(null);
          done();
        });
      });

      it('should not allow the user to use an invalid time', function(done) {
        testRef.child('/plan/pid2/child/time').set('eons', function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });
    });

    describe('privacy', function() {
      it('should not allow the user to read plans that belong to another user', function(done) {
        testRef.child('/plan/pid3').once('value', ignored, function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });

      it('should not allow the user to modify plans that belong to another user', function(done) {
        testRef.child('/plan/pid3/amount').set(999999, function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });
    });

    describe('deletion', function() {
      it('should allow the user to delete their own plans', function(done) {
        testRef.child('/plan/pid1').remove(function(error) {
          expect(error).toBe(null);
          done();
        });
      });

      it('should not allow the user to delete plans that belong to another user', function(done) {
        testRef.child('/plan/pid3').remove(function(error) {
          expect(error.code).toMatch(PERMISSION_DENIED);
          done();
        });
      });
    });
  });
});
