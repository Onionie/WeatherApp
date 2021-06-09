//jshint esversion:6
require('dotenv').config();
const express = require('express');
const https = require('https');
const app = express();

const apiKey = process.env.API_KEY;

app.get("/", function(req, res){
  https.get("https://api.openweathermap.org/data/2.5/weather?q=London&appid=" + apiKey + "&units=metric");
  console.log("App is running");
});


app.listen(3000, function(){
  console.log("Listening to port 3000");
});
