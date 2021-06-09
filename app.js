//jshint esversion:6
require('dotenv').config();
const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');

const app = express();



app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
  res.sendFile(__dirname + "/index.html");

});

app.post('/', function(req, res){
  const apiKey = process.env.API_KEY;
  const query = req.body.cityName;
  const units = "metric";

  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&" + units;
  https.get(url, function(response){
    console.log(response.statusCode);
    response.on('data', function(data){       //callback data
      const weatherData = JSON.parse(data); //parse the data into JSON
      const weatherDesc = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;
      const imageURL = "http://openweathermap.org/img/wn/" +icon +"@2x.png";
      console.log(weatherDesc);
      res.write("<p>Weather is</p>");
      res.write("<h1>The weather is  " + weatherDesc + " in" + query + "</h1>");
      res.write("<img src =" + imageURL + ">");
      res.send();
    });

  }); //https.get end
});




app.listen(3000, function(){
  console.log("Listening to port 3000");
});
