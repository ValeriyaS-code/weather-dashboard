
var cityInput = document.querySelector("#city-input");
var cityBtn = document.querySelector("#search-btn");
var cityNameEl = document.querySelector("#city-name");
var cityArr = [];
var apiKey = "235de05f6746ae6774a59552b6feb140";

var formHandler = function(event) {
    var selectedCity = cityInput
        .value
        .trim()
        .toLowerCase()
        .split(" ")
        .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
        .join(" ");

    if (selectedCity) {
        getCoords(selectedCity);
        cityInput.value = "";
    } else {
        alert("Please enter a city!");
    };
};

var getCoords = function(city) {
var currentWeatherApi = "api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}";

fetch(currentWeatherApi).then(function(response) {
    if (response.ok) {
    response.json().then(function(data) {
    var lon = data.coord["lon"];
    var lat = data.coord["lat"];
    getCityForecast(city, lon, lat);

    if (document.querySelector(".city-list")) {
    document.querySelector(".city-list").remove();
    }

    saveCity(city);
    loadCities();
    });
    } else {
    alert("Error: ${response.statusText}")
        }
    })
    .catch(function(error) {
        alert("Unable to load weather.");
    })
}

//fetching current weather and five-day forecast
var getCityForecast = function(city, lon, lat) {
var oneCallApi = "https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}";
fetch(oneCallApi).then(function(response) {
    if (response.ok) {
    response.json().then(function(data) {

    
    cityNameEl.textContent = "${city} (${moment().format("M/D/YYYY")})"; 
    console.log(data)
    currentForecast(data);
    fiveDayForecast(data);
});
}
})
}

//dispalying temperature
var displayTemp = function(element, temperature) {
    var tempEl = document.querySelector(element);
    var elementText = Math.round(temperature);
    tempEl.textContent = elementText;
}