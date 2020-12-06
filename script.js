var currentCity = "";
var apiKey = "238865a2d2158723334cf88f7fd88c92";

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

// city name, date, icon representing current conditions, temp, humidity, wind speed, UV index
// UV index color-coded favorable/moderate/severe
function displayCurrentWeather(response) {
    console.log(response);
    var unixTime = response.dt;
    var date = new Date(unixTime * 1000);
    var today = `${date.getMonth()+1}/${date.getDate()}/${date.getFullYear()}`;
    var weatherCode = response.weather[0].icon;
    var weatherIconSource = `http://openweathermap.org/img/wn/${weatherCode}@2x.png`;
    var temp = response.main.temp;
    var humidity = response.main.humidity;
    
}

// 5 day forecast displaying dates, icons for conditions, temps and humidities
function displayForecast(response) {
    console.log(response);
}

// Event Listener for city form
$("form").on("submit",function(event){
    event.preventDefault();
    currentCity = $("#city")[0].value;
    requestCurrentWeather();
    requestForecast();
});

