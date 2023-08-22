// API key for accessing the OpenWeatherMap API
var apiKey = '97fa0144a21139182aed6c24b1b8ee86';

// Display the current day on the page using JavaScript's Date object
$("#currentDay").text(new Date().toDateString());

// Event listener for search button. When clicked, retrieve and display weather data for the entered city
document.getElementById('searchBtn').addEventListener('click', function() {
    var cityName = document.getElementById('cityInput').value;
    getWeatherData(cityName);
});

// Fetch and handle weather data for the provided city
function getWeatherData(cityName) {
    // Get current weather data for the city
    fetch('https://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&units=metric&appid=' + apiKey)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        displayCurrentWeather(data); // Display the current weather
        saveToSearchHistory(cityName); // Save city to search history
        // Fetch the 5-day forecast for the city
        return fetch('https://api.openweathermap.org/data/2.5/forecast?q=' + cityName + '&units=metric&appid=' + apiKey);
    })
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        displayFiveDayForecast(data); // Display the 5-day forecast
    })
    .catch(function(error) {
        console.error("There was an error fetching the weather data.", error);
    });
}

// Display current weather data in the "currentWeather" div
function displayCurrentWeather(data) {
    var currentWeatherDiv = document.getElementById('currentWeather');
    currentWeatherDiv.innerHTML = '';
    currentWeatherDiv.innerHTML = [
        '<h2>', data.name, ' (', new Date().toLocaleDateString(), ')</h2>',
        '<img class="current-weather-icon" src="https://openweathermap.org/img/w/', data.weather[0].icon, '.png">',
        '<p>Temperature: ', Math.round(data.main.temp), '°C</p>',
        '<p>Humidity: ', data.main.humidity, '%</p>',
        '<p>Wind Speed: ', data.wind.speed, ' m/s</p>'
    ].join('');
}

// Display 5-day forecast data in the "futureCards" div
function displayFiveDayForecast(data) {
    var futureCardsDiv = document.getElementById('futureCards');
    futureCardsDiv.innerHTML = '';
    for (var i = 0; i < data.list.length; i += 8) {
        var forecast = data.list[i];
        futureCardsDiv.innerHTML += [
            '<div class="card">',
                '<h5 class="text-center">', new Date(forecast.dt_txt).toLocaleDateString(), '</h5>',
                '<img src="https://openweathermap.org/img/w/', forecast.weather[0].icon, '.png">',
                '<p class="future-temp">Temperature: ', Math.round(forecast.main.temp), '°C</p>',
                '<p class="future-humidity">Humidity: ', forecast.main.humidity, '%</p>',
                '<p class="future-windspeed">Wind Speed: ', forecast.wind.speed, ' m/s</p>',
            '</div>'
        ].join('');
    }
}

// Save the searched city to local storage for search history functionality
function saveToSearchHistory(cityName) {
    var searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    if (searchHistory.indexOf(cityName) === -1) {
        searchHistory.push(cityName);
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    }
    displaySearchHistory();
}

// Display the search history from local storage as a list of clickable buttons
function displaySearchHistory() {
    var historyList = document.getElementById('searchHistory');
    historyList.innerHTML = '';
    var searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    for (var i = 0; i < searchHistory.length; i++) {
        (function(city) {
            var cityButton = document.createElement('button');
            cityButton.textContent = city;
            cityButton.className = "history-button";
            cityButton.addEventListener('click', function() {
                getWeatherData(city);
            });
            historyList.appendChild(cityButton);
        })(searchHistory[i]);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    var searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    if (searchHistory.length > 0) {
        getWeatherData(searchHistory[searchHistory.length - 1]);
    }
    displaySearchHistory();
});