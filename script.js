var citiesArr = [];
var numOfCities = 5;
var searchCityForm = $("#searchCityForm");
var searchedCities = $("#searchedCityEl");

var currentDate = document.querySelector("#currentDate");
var today = moment();
currentDate.textContent = today.format("MMM Do YYYY");

var cityWeatherPull = function (searchCityName) {
    fetch('https://api.openweathermap.org/data/2.5/weather?q=' + searchCityName + '&appid=b4e179a8b169927bbbf8d46d7054d6b7' + '&units=imperial')
    .then (function (response) {
        if (response.ok) {
            return response.json().then(function (response) {
                $("#cityName").html(response.name);
                $("#tempToday").html(response.main.temp + " \u00B0F");
                $("#humidityToday").html(response.main.humidity + "%")
                $("#windSpeedToday").html(response.wind.speed + " MPH");

                var lat = response.coord.lat;
                var lon = response.coord.lon;

                uvPull(lat, lon);
                forecastPull(lat, lon);
            });
        } else {
            alert("Please enter a valid city name.");
        }
    });
};

var uvPull = function (lat, lon) {
    fetch('https://api.openweathermap.org/data/2.5/uvi?' + 'appid=b4e179a8b169927bbbf8d46d7054d6b7' + '&lat=' + lat + '&lon=' + lon + '&units=imperial')
    .then(function (response) {
        return response.json();
    })
    .then(function (response) {
        $("#uvIndexToday").removeClass();
        $("#uvIndexToday").html(response.value);
        
        if (response.value < 3) {
            $("#uvIndexToday").addClass("p-1 rounded bg-success text-white");
        } else if (response.value < 8) {
            $("#uvIndexToday").addClass("p-1 rounded bg-warning text-white");
        } else {
            $("#uvIndexToday").addClass("p-1 rounded bg-danger text-white");
        }
    });
};

var forecastPull = function (lat, lon) {
    fetch('https://api.openweathermap.org/data/2.5/onecall?' + 'lat=' + lat + '&lon=' + lon + '&exclude=current,minutely,hourly' + '&appid=b4e179a8b169927bbbf8d46d7054d6b7' + '&units=imperial')
    .then(function (response) {
        return response.json();
    })
    .then(function (response) {
        for (var i = 1; i < 6; i++) {
            var unixTime = response.daily[i].dt;
            var date = moment.unix(unixTime).format("MM/DD/YY");
            $("#date" + i).html(date);


            var weatherImg = 'http://openweathermap.org/img/wn/' + response.daily[i].weather[0].icon + '@2x.png';
            $("#weatherIconDay" + i).attr("src", weatherImg);

            var temp = response.daily[i].temp.day + " \u00B0F";
            $("#tempDay" + i).html(temp);

            var humidity = response.daily[i].humidity;
            $("#humidityDay" + i).html(humidity + "%");
        }
    });
};




var createBtn = function(btnText) {
    var btn = $("<button>").text(btnText).addClass("list-group-item-action").attr("type", "submit");
    return btn;
};

var loadCities = function () {
    citiesArr = JSON.parse(localStorage.getItem("weatherInfo"));
    if (citiesArr === null) {
        citiesArr = [];
    }
    for (var i = 0; i <citiesArr.length; i++) {
        var cityNameBtn = createBtn(citiesArr[i]);
        searchedCities.append(cityNameBtn);
    }
};

var saveCityName = function (searchCityName) {
    var newCity = 0;
    citiesArr = JSON.parse(localStorage.getItem("weatherInfo"));

    if (citiesArr === null) {
        citiesArr = [];
        citiesArr.unshift(searchCityName);
    } else {
        for (var i = 0; i < citiesArr.length; i++) {
            if (searchCityName.toLowerCase() === citiesArr[i].toLowerCase()) {
                return newCity;
            }
        }
        if (citiesArr.length < numOfCities) {
            citiesArr.unshift(searchCityName);
        } else {
            citiesArr.pop();
            citiesArr.unshift(searchCityName);
        }
    }
    localStorage.setItem("weatherInfo", JSON.stringify(citiesArr));
    newCity = 1;
    return newCity;
};

var createCityNameBtn = function (searchCityName) {
    var saveCities = JSON.parse(localStorage.getItem("weatherInfo"));

    if (saveCities.length = 1) {
        var cityNameBtn = createBtn(saveCityName);
        searchedCities.prepend(cityNameBtn);
    } else {
        for (var i = 1; i < saveCities.length; i++) 
        if (saveCityName.toLowerCase() = saveCities[i].toLowerCase()) {
            return;
        }
        
        if (searchedCities[0].childElementCount < numOfCities) {
            var cityNameBtn = createBtn(searchCityName);
        } else {
            searchedCities[0].removeChild(searchedCities[0].lastChild);
            var cityNameBtn = createBtn(searchCityName);
        }
        searchedCities.prepend(cityNameBtn);
        $(":button.list-group-item-action").on("click", function() {
            submitButtonClick(event);
        });
    }
};

loadCities();

var formSubmitEvent = function(event) {
    event.preventDefault();

    var searchCityName = $("#searchCity").val().trim();
    var newCity = saveCityName(searchCityName);
    cityWeatherPull(searchCityName);
    if (newCity = 1) {
        createCityNameBtn(searchCityName);
    }
};

var submitButtonClick = function(event) {
    event.preventDefault();

    var searchCityName = event.target.textContent.trim();
    cityWeatherPull(searchCityName);
};

$("#searchCityForm").on("submit", function() {
    formSubmitEvent(event);
});

$(":button.list-group-item-action").on("click", function () {
    submitButtonClick(event);
});