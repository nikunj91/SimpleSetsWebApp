var redis 		= require('redis')
var multer  	= require('multer')
var express 	= require('express')
var fs      	= require('fs')
var httpproxy 	= require('http-proxy')
var http 		= require('http')
var sets 	= require('./simplesets.js')
var app 		= express()
var getIP = require('external-ip')();

var redisServer = fs.readFileSync("/etc/keys/redis.json");
var redisDetails = JSON.parse(redisServer);

var client = redis.createClient(parseInt(redisDetails.redisPort), redisDetails.redisIp, {})

var store = {};

app.get('/', function(req, res) {
  res.send('Simple Sets Application. Master')
})

app.get('/set/:set/create', function(req, res) {
    store[req.params.set] = new sets.Set();
    console.log(store[req.params.set]);
    res.send('Set '+req.params.set+' created..');
})

app.get('/set/:set/add/:value', function(req, res) {
	store[req.params.set] = store[req.params.set].add(req.params.value);
    res.send('Value '+req.params.value+' added to the set '+req.params.set);  
})

app.get('/set/:set/remove/:value', function(req, res) {

  client.get('removeset', function(err, value) {
    if (value === 'Enabled') {
        store[req.params.set] = store[req.params.set].remove(req.params.value);
        res.send('Value '+req.params.value+' removed from the set '+req.params.set);
    } else {
      res.send("Remove Set feature is currently disabled");
    }
  });

})

app.get('/set/:set/show', function(req, res) {
	    res.send(store[req.params.set].array());
    
})

// HTTP SERVER

var server = app.listen(3000, function () {
    getIP(function (err, ip) {
      var host = server.address().address
      var port = server.address().port
      client.lrem("servers",0,"http://"+ip+":"+port, function(err, reply) {
        client.lpush("servers","http://"+ip+":"+port, function(err, reply) {
          console.log(reply);
        });
      });
      console.log("App listening at http://"+ip+":"+port);
    });
})
