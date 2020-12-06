var currentCity = "";
var apiKey = "238865a2d2158723334cf88f7fd88c92";
var latitude;
var longitude;

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
        displayCurrentWeather(response);

        latitude = response.coord.lat;
        longitude = response.coord.lon;
        queryURL = "https://api.openweathermap.org/data/2.5/uvi?lat=" + latitude + "&lon=" + longitude + "&appid=" + apiKey;
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response){
            displayUVIndex(response);
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

// city name, date, icon representing current conditions, temp, humidity, wind speed
function displayCurrentWeather(response) {
    console.log("current",response);
    var unixTime = response.dt;
    var date = new Date(unixTime * 1000);
    var today = `${date.getMonth()+1}/${date.getDate()}/${date.getFullYear()}`;
    var weatherCode = response.weather[0].icon;
    var weatherIconSource = `http://openweathermap.org/img/wn/${weatherCode}@2x.png`;
    var temp = response.main.temp;
    var humidity = response.main.humidity;
    var windSpeed = response.wind.speed;
    latitude = response.coord.lat;
    longitude = response.coord.lon;
}

// UV index color-coded favorable/moderate/severe
function displayUVIndex(response) {
    console.log("UV",response.value);
}

// 5 day forecast displaying dates, icons for conditions, temps and humidities
function displayForecast(response) {
    console.log("forecast",response);
}

// Event Listener for city form
$("form").on("submit",function(event){
    event.preventDefault();
    currentCity = $("#city")[0].value;
    requestCurrentWeather();
    requestForecast();
});

