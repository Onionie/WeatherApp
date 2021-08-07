//jshint esversion:6
require('dotenv').config(); // for my api
const express = require('express'); //to use express
const https = require('https'); //to fetch https api
const path = require('path');
const ejs = require("ejs");
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

var temperature;
//To use EJS
app.set('view engine', 'ejs');

//To use styling through public folder
app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){

  const sendData = {
  }
  res.render('index', {
    SendData: sendData
  });

});

app.post('/', function(req, res){
  const apiKey = process.env.API_KEY;
  const query = req.body.City;
  const units = "imperial";

  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=" + units;

  //const url = "https://api.openweathermap.org/data/2.5/forecast?q=" + query + "&appid=6eb4982f4049ecc9d77e39da9691fce8&units=imperial";
  https.get(url, function(response){
    console.log(response.statusCode);
    response.on('data', function(data1){       //callback data
      const weatherData = JSON.parse(data1); //parse the data into JSON
      const mainLocationCity = weatherData.name;
      const mainIcon = weatherData.weather[0].icon;
      const iconURL = "http://openweathermap.org/img/wn/" +mainIcon +"@2x.png";
      const mainDesc = weatherData.weather[0].description;
      const mainTemp = weatherData.main.temp;


      const sendData= {};
      sendData.location = mainLocationCity;
      sendData.currIcon = iconURL;
      sendData.currDesc = mainDesc;
      sendData.currTemp = Math.floor(mainTemp) + "°F";
      res.render('index',{
        SendData: sendData
      });
    });
  });





  // https.get(url, function(response){
  //   console.log(response.statusCode);
  //   response.on('data', function(data){       //callback data
  //     const weatherData = JSON.parse(data); //parse the data into JSON
  //     const weatherDesc = weatherData.weather[0].description;
  //     const icon = weatherData.weather[0].icon;
  //     const imageURL = "http://openweathermap.org/img/wn/" +icon +"@2x.png";
  //     const weatherTemp = weatherData.main.temp;
  //     res.write("<h1>The Temperature is: " + weatherTemp + " Degrees in Fahrenheit" + "</h1>");
  //     res.write("<h1>The weather is  like " + weatherDesc + " in " + query + "</h1>");
  //     res.write("<img src =" + imageURL + ">");
  //     res.send();
  //   });
  //
  // }); //https.get end
});




app.listen(port, function(){
  console.log("Listening to port 3000");
});
