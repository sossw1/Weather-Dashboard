var currentCity = "";
var apiKey = "238865a2d2158723334cf88f7fd88c92";

function requestWeather(){

}

// Event Listener for city form
$("form").on("submit",function(event){
    event.preventDefault();
    currentCity = $("#city")[0].value;
    requestWeather();
});

