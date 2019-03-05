const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const Redis = require('ioredis');
var redis = new Redis({
  port: 6379,          // Redis port
  host: 'redis',   // Redis host
  db: 0
});

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// Connect using MongoClient
MongoClient.connect("mongodb://mongodb:27017", function(err, client) {
  if(err){
    return console.error(err, client);
  }
  // Use the admin database for the operation
  const logCollection = client.db("test").collection("log");
  // List all the available databases
  
  // App
  const app = express();
  app.get('/', async (req, res) => {
    const logList =  await logCollection.find().toArray();
    const view = await redis.get("view");
    console.log(logList.length);
    res.send(`Hello world, this page is viewed ${view} times.\n`);
    await redis.incr("view");
    await logCollection.insertOne({
      log: view
    });
  });

  app.listen(PORT, HOST);
  console.log(`Running on version3 http://${HOST}:${PORT}`);
});