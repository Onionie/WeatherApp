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

  //Current Weather
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=" + units;

  https.get(url, function(response){
    console.log(response.statusCode);
    response.on('data', function(data1){       //callback data
      const weatherData = JSON.parse(data1); //parse the data into JSON
      console.log(weatherData);
      const mainLocationCity = weatherData.name;
      const mainIcon = weatherData.weather[0].icon;
      const iconURL = "http://openweathermap.org/img/wn/" +mainIcon +"@2x.png";
      const mainDesc = weatherData.weather[0].description;
      const mainTemp = weatherData.main.temp;
      const mainHumidity = weatherData.main.humidity;
      const mainWindSpeed = weatherData.wind.speed;
      const mainTempMin = Math.floor(weatherData.main.temp_min);
      const mainTempMax = Math.floor(weatherData.main.temp_max);

      const sendData= {};
      sendData.location = mainLocationCity;
      sendData.currIcon = iconURL;
      sendData.currDesc = mainDesc;
      sendData.currTemp = Math.floor(mainTemp) + "°F";
      sendData.currHumidity = "Humidity: " + mainHumidity + "%";
      sendData.currWindSpeed = "Wind Speed: " + mainWindSpeed + " mph";
      sendData.currTempMin = "Min. Temp: " + mainTempMin + "°F";
      sendData.currTempMax = "Max. Temp: " + mainTempMax + "°F";

      res.render('index',{
        SendData: sendData
      });
    });
  });
}); //app.post end

//5 Day Forecast Section
app.get('/forecast', (req, res) =>{
  const sendData1 = {}
  res.render('forecast', {
    SendData: sendData1
  });
});

app.post('/forecast', (req, res) =>{
  const apiKey = process.env.API_KEY;
  const query = req.body.City;

  const url1 = "https://api.openweathermap.org/data/2.5/forecast?q=" + query + "&appid=" + apiKey + "&units=imperial";
  https.get(url1, (response)=>{
    response.on('data', (data2) => {
      const forecastData = JSON.parse(data2);
      console.log(forecastData);

      //Day 1

      const day1Date = (forecastData.list[1].dt_txt).slice(5, 10);
      const day1temp = Math.floor(forecastData.list[1].main.temp);
      const day1IconURL = "http://openweathermap.org/img/wn/" + forecastData.list[1].weather[0].icon +"@2x.png";
      const day1Desc = forecastData.list[1].weather[0].description;
      const day1Humidity = forecastData.list[1].main.humidity;
      const day1windSpeed = forecastData.list[1].wind.speed;
      // const mainWindSpeed = weatherData.wind.speed;
      // const mainTempMin = Math.floor(weatherData.main.temp_min);
      // const mainTempMax = Math.floor(weatherData.main.temp_max);



      const sendData1 = {};
      sendData1.day1Date = day1Date;
      sendData1.day1Temp = day1temp + "°F";
      sendData1.day1Icon = day1IconURL;
      sendData1.day1Desc = day1Desc;
      sendData1.day1Humidity = "Humidity: " + day1Humidity + "%";
      sendData1.day1WindSpeed = "Wind Speed: " + day1windSpeed + "mph";

      res.render('forecast', {
        SendData: sendData1
      });

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





app.listen(port, function(){
  console.log("Listening to port 3000");
});
