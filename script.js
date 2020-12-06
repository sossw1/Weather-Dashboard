var currentCity = "";
var apiKey = "238865a2d2158723334cf88f7fd88c92";

function requestCurrentWeather(){
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + currentCity + "&appid=" + apiKey;

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
        console.log(response);
    });
}

function requestFiveDay(){
    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + currentCity + "&appid=" + apiKey;

    $.ajax({
        url: queryURL,
        method: "GET",
    }).then(function(response){
        console.log(response);
    })
}

// Event Listener for city form
$("form").on("submit",function(event){
    event.preventDefault();
    currentCity = $("#city")[0].value;
    requestCurrentWeather();
    requestFiveDay();
});

