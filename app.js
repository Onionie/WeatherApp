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
  https.get(url1, function(response){
    let result = '';
    response.on("data", (data2) =>{
        result += data2;
    });
    response.on('end', () => {
      const forecastData = JSON.parse(result);
      console.log(forecastData);

      const sendData1 = {};

      //Day 1

      const day1Date = (forecastData.list[1].dt_txt).slice(5, 10);
      const day1temp = Math.floor(forecastData.list[1].main.temp);
      const day1IconURL = "http://openweathermap.org/img/wn/" + forecastData.list[1].weather[0].icon +"@2x.png";
      const day1Desc = forecastData.list[1].weather[0].description;
      const day1Humidity = forecastData.list[1].main.humidity;
      const day1windSpeed = forecastData.list[1].wind.speed;

      //Day 1
      sendData1.day1Date = day1Date;
      sendData1.day1Temp = day1temp + "°F";
      sendData1.day1Icon = day1IconURL;
      sendData1.day1Desc = day1Desc;
      sendData1.day1Humidity = "Humidity: " + day1Humidity + "%";
      sendData1.day1WindSpeed = "Wind Speed: " + day1windSpeed + "mph";

      //Day 2
      const day2Date = (forecastData.list[8].dt_txt).slice(5, 10);
      const day2temp = Math.floor(forecastData.list[8].main.temp);
      const day2IconURL = "http://openweathermap.org/img/wn/" + forecastData.list[8].weather[0].icon +"@2x.png";
      const day2Desc = forecastData.list[8].weather[0].description;
      const day2Humidity = forecastData.list[8].main.humidity;
      const day2windSpeed = forecastData.list[8].wind.speed;

      sendData1.day2Date = day2Date;
      sendData1.day2Temp = day2temp + "°F";
      sendData1.day2Icon = day2IconURL;
      sendData1.day2Desc = day2Desc;
      sendData1.day2Humidity = "Humidity: " + day2Humidity + "%";
      sendData1.day2WindSpeed = "Wind Speed: " + day2windSpeed + "mph";

      //Day 3
      const day3Date = (forecastData.list[16].dt_txt).slice(5, 10);
      const day3temp = Math.floor(forecastData.list[16].main.temp);
      const day3IconURL = "http://openweathermap.org/img/wn/" + forecastData.list[16].weather[0].icon +"@2x.png";
      const day3Desc = forecastData.list[16].weather[0].description;
      const day3Humidity = forecastData.list[16].main.humidity;
      const day3windSpeed = forecastData.list[16].wind.speed;

      sendData1.day3Date = day3Date;
      sendData1.day3Temp = day3temp + "°F";
      sendData1.day3Icon = day3IconURL;
      sendData1.day3Desc = day3Desc;
      sendData1.day3Humidity = "Humidity: " + day3Humidity + "%";
      sendData1.day3WindSpeed = "Wind Speed: " + day3windSpeed + "mph";






      res.render('forecast', {
        SendData: sendData1
      });
    });
  }); //https.get end
}); //app.post end

app.listen(port, function(){
  console.log("Listening to port 3000");
});
