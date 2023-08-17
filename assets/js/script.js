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
        displayCurrentWeather(data);
        return fetch('https://api.openweathermap.org/data/2.5/forecast?q=' + cityName + '&units=metric&appid=' + apiKey);
    })
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        displayFiveDayForecast(data);
    })
    .catch(function(error) {
        console.error("There was an error fetching the weather data.", error);
    });
}

function displayCurrentWeather(data) {
    var currentWeatherDiv = document.getElementById('currentWeather');
    currentWeatherDiv.innerHTML = '';
    currentWeatherDiv.innerHTML = [
        '<h2>', data.name, ' (', new Date().toLocaleDateString(), ')</h2>',
        '<img src="https://openweathermap.org/img/w/', data.weather[0].icon, '.png">',
        '<p>Temperature: ', data.main.temp, '°C</p>',
        '<p>Humidity: ', data.main.humidity, '%</p>',
        '<p>Wind Speed: ', data.wind.speed, ' m/s</p>'
    ].join('');
}

function displayFiveDayForecast(data) {
    var futureCardsDiv = document.getElementById('futureCards');
    futureCardsDiv.innerHTML = '';
    for (var i = 0; i < data.list.length; i += 8) {
        var forecast = data.list[i];
        futureCardsDiv.innerHTML += [
            '<div class="card">',
                '<h4>', new Date(forecast.dt_txt).toLocaleDateString(), '</h4>',
                '<img src="https://openweathermap.org/img/w/', forecast.weather[0].icon, '.png">',
                '<p>Temperature: ', forecast.main.temp, '°C</p>',
                '<p>Humidity: ', forecast.main.humidity, '%</p>',
                '<p>Wind Speed: ', forecast.wind.speed, ' m/s</p>',
            '</div>'
        ].join('');
    }
}

function saveToSearchHistory(cityName) {
    var searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    if (searchHistory.indexOf(cityName) === -1) {
        searchHistory.push(cityName);
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    }
    displaySearchHistory();
}

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