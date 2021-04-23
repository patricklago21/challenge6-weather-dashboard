var citiesListArr = [];
var numOfCities = 5;
var searchCityForm = $("#searchCityForm");
var searchedCities = $("#searchedCityLi");

var getCityWeather = function (searchCityName) {
    fetch('https://api.openweathermap.org/data/2.5/weather?q=' + searchCityName + '&appid=b4e179a8b169927bbbf8d46d7054d6b7' + '&units=imperial')
    .then (function (response) {
        if (response.ok) {
            return response.json().then(function (response) {
                $("#cityName").html(response.name);
                var unixTime = response.dt;
                var date = moment.unix(unixTime).format("MM/DD/YY");
                $("#currentdate").html(date);

                var weatherIncoUrl = "http://openweathermap.org/img/wn/" + response.weather[0] + "@2x.png";
                $("#weatherIconToday").attr("src", weatherIncoUrl);
                $("#tempToday").html(response.main.temp + " \u00B0F");
                $("#humidityToday").html(response.main.humidity + "%")
                $("#windSpeedToday").html(response.wind.speed + " MPH");

                var lat = response.coord.lat;
                var lon = response.coord.lon;

                getUVIndex(lat, lon);
                getForecast(lat, lon);
            });
        } else {
            alert("Please provide a valid city name.");
        }
    });
};

var getUVIndex = function (lat, lon) {
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

var getForecast = function (lat, lon) {
    fetch('https://api.openweathermap.org/data/2.5/onecall?' + 'lat=' + lat + '&lon=' + lon + '&exclude=current,minutely,hourly' + '&appid=b4e179a8b169927bbbf8d46d7054d6b7' + '&units=imperial')
    .then(function (response) {
        return response.json();
    })
    .then(function (response) {
        for (var i = 1; i < 6; i++) {
            var unixTime = response.daily[i].dt;
            var date = moment.unix(unixTime).format("MM/DD/YY");
            $("#Date" + i).html(date);

            var weatherIncoUrl = 'http://openweathermap.org/img/wn/' + response.daily[i].weather[0].icon + '@2x.png';
            $("#weatherIconDay" + i).attr("src", weatherIncoUrl);

            var temp = response.daily[i].temp.day + " \u00B0F";
            $("#tempDay" + i).html(temp);

            var humidity = response.daily[i].humidity;
            $("#humidityDay" + i).html(humidity + "%");
        }
    });
};

