//jshint esversion:6
require('dotenv').config();
const express = require('express');
const https = require('https');
const app = express();

const apiKey = process.env.API_KEY;

app.get("/", function(req, res){
  const url = "https://api.openweathermap.org/data/2.5/weather?q=London&appid=" + apiKey + "&units=metric";
  https.get(url, function(response){
    console.log(response.statusCode);
    response.on('data', function(data){       //callback data
      const weatherData = JSON.parse(data); //parse the data into JSON
      var weatherDesc = weatherData.weather[0].description;
      console.log(weatherDesc);
      res.send("The weather is  " + weatherDesc);
    });

  });

});


app.listen(3000, function(){
  console.log("Listening to port 3000");
});
