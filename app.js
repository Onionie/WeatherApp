//jshint esversion:6
const express = require('express');
const https = require('https');
const app = express();

app.get("/", function(req, res){
  console.log("App is running");
});


app.listen(3000, function(){
  console.log("Listening to port 3000");
});
