
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

    
    cityNameEl.textContent = '${city} (${moment().format("M/D/YYYY")})'; 
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

//displaying current forecast
var currentForecast = function(forecast) {
var forecastEl = document.querySelector(".city-forecast");
forecastEl.classList.remove("hide");

var weatherIconEl = document.querySelector("#today-icon");
var currentIcon = forecast.current.weather[0].icon;
weatherIconEl.setAttribute("src", "http://openweathermap.org/img/wn/${currentIcon}.png");
weatherIconEl.setAttribute("alt", forecast.current.weather[0].main)

displayTemp("#current-temp", forecast.current["temp"]);
displayTemp("#current-feels-like", forecast.current["feels_like"]);
displayTemp("#current-high", forecast.daily[0].temp.max);
displayTemp("#current-low", forecast.daily[0].temp.min);

var currentConditionEl = document.querySelector("#current-condition");
currentConditionEl.textContent = forecast.current.weather[0].description
.split(" ")
.map((s) => s.charAt(0).toUpperCase() + s.substring(1))
.join(" ");

var currentHumidityEl = document.querySelector("#current-humidity");
currentHumidityEl.textContent = forecast.current["humidity"];

var currentWindEl = document.querySelector("#current-wind-speed")
currentWindEl.textContent = forecast.current["wind_speed"];

var uviEl = document.querySelector("#current-uvi")
var currentUvi = forecast.current["uvi"];
uviEl.textContent = currentUvi;

switch (true) {
    case (currentUvi <= 2):
        uviEl.className = "badge badge-success";
    break;
    case (currentUvi <= 5):
        uviEl.className = "badge badge-warning";
    break;
    case (currentUvi <=7):
        uviEl.className = "badge badge-danger";
    break;
    default:
        uviEl.className = "badge text-light";
        uviEl.setAttribute("style", "background-color: #87bba2");
    }
}

var fiveDayForecast = function(forecast) { 
for (var i = 1; i < 6; i++) {
    var dateP = document.querySelector("#date-" + i);
    dateP.textContent = moment().add(i, "days").format("M/D/YYYY");

    var iconImg = document.querySelector("#icon-" + i);
    var iconCode = forecast.daily[i].weather[0].icon;
    iconImg.setAttribute("src", `http://openweathermap.org/img/wn/${iconCode}.png`);
    iconImg.setAttribute("alt", forecast.daily[i].weather[0].main);

    displayTemp("#temp-" + i, forecast.daily[i].temp.day);
    displayTemp("#high-" + i, forecast.daily[i].temp.max);
    displayTemp("#low-" + i, forecast.daily[i].temp.min);

    var humiditySpan = document.querySelector("#humidity-" + i);
    humiditySpan.textContent = forecast.daily[i].humidity;
    }
}