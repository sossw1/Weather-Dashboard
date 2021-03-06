var currentCity = "";
var apiKey = "238865a2d2158723334cf88f7fd88c92";
var latitude;
var longitude;
var cityHistory = JSON.parse(localStorage.getItem("history")) || [];

loadHistory();

if(currentCity !== "") {
    requestCurrentWeather();
    requestForecast();
}

// Returns an array containing history from local storage
function loadHistory() {
    var stringHistory = localStorage.getItem("history");
    if(stringHistory !== null) {
        var arrayHistory = JSON.parse(stringHistory);
        // Add buttons
        for(let i=0; i<arrayHistory.length; i++) {
            newButton(arrayHistory[i]);
        }
        return arrayHistory;
    } else {
        return [];
    }
}

function newButton(str) {
    currentCity = str;
    // Test for duplicates
    var noDuplicates = true;
    for(let i=0; i<cityHistory.length; i++) {
        if(str === cityHistory[i]) {
            noDuplicates = false;
        }
    }
    if(noDuplicates === true) {
        // Add entry to history
        cityHistory.push(str);
        localStorage.setItem("history",JSON.stringify(cityHistory));
        // Add button
        var cityList = $(".city-list");
        var cityButton = $(`<span class='city-button' id='${str}'>${str}</button>`);
        cityButton.on("click",function(event){
            // When clicked, change current city and display results for current city
            currentCity = event.target.id;
            requestCurrentWeather();
            requestForecast();
        });
        cityList.append(cityButton);
        cityList.append("<hr>");
    }
}

function requestCurrentWeather(){
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + currentCity + "&appid=" + apiKey + "&units=imperial";

    $.ajax({
        url: queryURL,
        method: "GET",
        statusCode: {
            400: function() {
                alert("Please enter a city.");
            },
            404: function() {
                alert("Invalid city, please try again.")
            }
          }
    }).then(function(response){

        newButton(currentCity);
        // Call API for UV index using latitude/longitude from previous response
        var currentWeatherResponse = response;
        latitude = response.coord.lat;
        longitude = response.coord.lon;
        queryURL = "https://api.openweathermap.org/data/2.5/uvi?lat=" + latitude + "&lon=" + longitude + "&appid=" + apiKey;
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response){
            var uvIndexResponse = response;
            displayCurrentWeather(currentWeatherResponse,uvIndexResponse);
        })

    });
}

function requestForecast(){
    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + currentCity + "&appid=" + apiKey + "&units=imperial";

    $.ajax({
        url: queryURL,
        method: "GET",
    }).then(function(response){
        displayForecast(response);
    })
}

function displayCurrentWeather(response1,response2) {
    // Empty current weather display
    $(".current-weather").empty();
    // Get values for city name, date, current weather icon, temp, humidity, wind speed and UV index-
    var unixTime = response1.dt;
    var date = new Date(unixTime * 1000);
    var today = `${date.getMonth()+1}/${date.getDate()}/${date.getFullYear()}`;
    var weatherCode = response1.weather[0].icon;
    var weatherIconSource = `http://openweathermap.org/img/wn/${weatherCode}@2x.png`;
    var temp = response1.main.temp.toFixed(1);
    var humidity = response1.main.humidity;
    var windSpeed = response1.wind.speed.toFixed(1);
    var uvIndex = response2.value.toFixed(1);

    // Display values
    var displayDiv = $(".current-weather");
    displayDiv.attr("id","current-weather");
    displayDiv.append(`<h2 style='float:left'>${currentCity} (${today})`);
    displayDiv.append(`<img style='float:left' width='70px' src=${weatherIconSource}>`);
    displayDiv.append(`<p style='clear:left'>Temperature: ${temp}\xB0 F`);
    displayDiv.append(`<p>Humidity: ${humidity}%`);
    displayDiv.append(`<p>Wind Speed: ${windSpeed} MPH`);

    displayDiv.append(`<div id='uv-div'>UV Index: `);
    $("#uv-div").append(`<span id='uv' class='clearfix'>${uvIndex}`);
    var uvSpan = $("#uv");
    if(uvIndex<3) {
        uvSpan.addClass("greenUV");
    } else if (uvIndex>=6) {
        uvSpan.addClass("redUV");
    } else {
        uvSpan.addClass("yellowUV");
    }
}

function displayForecast(response) {
    // Empty forecast display
    $("#forecast").empty();
    forecastDiv = $("#forecast");
    for(let i=0; i<5; i++) {
        // Get values for date, weather condition icon, temp and humidity
        var index = (8*i)+3;
        var card = `<div class='card' id='day${i}'>`;
        var responseDate = response.list[index].dt_txt;
        var cardDate = responseDate.slice(5,7) + "/" + responseDate.slice(8,10) + "/" + responseDate.slice(0,4);
        var cardIconSource = `http://openweathermap.org/img/wn/${response.list[index].weather[0].icon}@2x.png`;
        var temp = response.list[index].main.temp.toFixed(1);
        var humidity = response.list[index].main.humidity;
        // Display forecast
        forecastDiv.append(card);
        var cardDiv = $(`#day${i}`);
        cardDiv.append(`<p>${cardDate}`);
        cardDiv.append(`<img src=${cardIconSource}>`);
        cardDiv.append(`<p>Temperature: ${temp}\xB0 F`);
        cardDiv.append(`<p>Humidity: ${humidity}%`);
    }
}

// Event Listener for city form
$("form").on("submit",function(event){
    event.preventDefault();
    currentCity = $("#city")[0].value;
    requestCurrentWeather();
    requestForecast();
});

