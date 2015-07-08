var express = require('express');
var router = express.Router();

var database = require('../classes/database.js');

// Create data
router.post('/add', function(req, res) {
  // Extract & log
  var body = req.body;
  console.log("Recieved add request: " + JSON.stringify(body));

  // Perform the database load (add) operaton on the created object
  var toLoad = [];
  toLoad.push(body);
  database.load(toLoad);

  // Render page notifying success
  res.send(req.body);
});

// Read data
router.get('/get', function(req, res) {
  returnGet(res);
});

// Delete data
router.delete('/del', function(req, res) {
  // Extract & log
  var body = req.body;
  console.log("Recieved delete request for ID: " + JSON.stringify(body));

  // Perform removal from database
  database.remove(body);

  // Render page notifying success
  res.send(req.body);
});

// ===================================================================
// Helper function with async callback - for read
var returnGet = function(res) {
  database.get(function(toSend) {
    res.send(toSend);
  });
};

module.exports = router;
