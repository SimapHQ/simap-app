'use strict';

var fs = require('fs'),
    https = require('https');

var TARGET = 'simap-test',
    SECRET = JSON.parse(fs.readFileSync('/Users/drautb/.firebases/' + TARGET)).token;

var options = {
  host: TARGET + '.firebaseio.com',
  port: 443,
  path: '/.settings/rules.json?auth=' + SECRET,
  method: 'PUT'
};

console.log('Updating security rules on [' + TARGET + ']...');

var request = https.request(options, function(response) {
  response.on('data', function(d) {
    process.stdout.write(d + '\n');
  });
});

var rules = fs.readFileSync(__dirname + '/../../../rules.json');
request.write(rules + '\n');
request.end();

request.on('error', function(e) {
  console.error(e);
});
