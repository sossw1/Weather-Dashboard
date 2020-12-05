var currentCity = "";
var apiKey = "238865a2d2158723334cf88f7fd88c92";

function requestWeather(){
    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + currentCity + "&appid=" + apiKey;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response){
        console.log(response);
    });
}

// Event Listener for city form
$("form").on("submit",function(event){
    event.preventDefault();
    currentCity = $("#city")[0].value;
    requestWeather();
});

