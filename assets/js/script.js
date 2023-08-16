var apiKey = '97fa0144a21139182aed6c24b1b8ee86';

$("#currentDay").text(new Date().toDateString());
document.getElementById('searchBtn').addEventListener('click', function() {
    var cityName = document.getElementById('cityInput').value;
    getWeatherData(cityName);
});

function getWeatherData(cityName) {
    fetch('https://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&units=metric&appid=' + apiKey)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        console.log("Current weather data:", data);
        return fetch('https://api.openweathermap.org/data/2.5/forecast?q=' + cityName + '&units=metric&appid=' + apiKey);
    })
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        console.log("5-day forecast data:", data);
    })
    .catch(function(error) {
        console.error("There was an error fetching the weather data.", error);
    });
}