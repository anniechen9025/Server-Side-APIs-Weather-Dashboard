var previousSearchArray = JSON.parse(localStorage.getItem("cities")) || [];

$("#btn-block").on("click", function (event) {
    event.preventDefault();
    var locationInput = $("#search-input").val();
    if (previousSearchArray.indexOf(locationInput) === -1) {
        var btn = $("<button>").text(locationInput)
        $("#history").append(btn);
        previousSearchArray.push(locationInput);
        localStorage.setItem("cities", JSON.stringify(previousSearchArray));
    };

    callApi(locationInput);
});

function callApi(locationInput) {
    let currentUrl = `http://api.openweathermap.org/data/2.5/weather?q=${locationInput}&appid=b1d6ed48c3dd6c40752c54b2271b1309`;
    let forecastUrl = `http://api.openweathermap.org/data/2.5/forecast?q=${locationInput}&appid=b1d6ed48c3dd6c40752c54b2271b1309`;
    fetch(currentUrl).then(function (response) {
        return response.json();
    }).then(function (data) {
        $("#current_icon").empty();
        $("#location").empty();
        $("#temperture").empty();
        $("#humidity").empty();
        $("#windspeed").empty();
        var icon = data.weather[0].icon;
        var iconUrl = "http://openweathermap.org/img/w/" + icon + ".png";
        $("#current_icon").html(`<img src=${iconUrl}>`);
        var currentDate = moment().format('L');
        var location = data.name + "(" + currentDate + ")";
        $("#location").append(location);
        var temperture = (((data.main.temp - 273.15) * 1.8) + 32).toString().slice(0, 4);
        var tempPharse = "Temperture = " + temperture + "F";
        $("#temperture").append(tempPharse);
        var humidity = "Humidity = " + data.main.humidity + "%";
        $("#humidity").append(humidity);
        var wind = "Wind Speed = " + data.wind.speed + " MPH";
        $("#windspeed").append(wind);

        let lat = data.coord.lat;
        let lng = data.coord.lon;
        let onecallUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lng}&exclude=minutely,hourly,alerts&appid=b1d6ed48c3dd6c40752c54b2271b1309`;
        fetch(onecallUrl).then(function (response) {
            return response.json();
        }).then(function (data) {
            $("#uvindex").empty();
            let uvIndex = data.daily[0].uvi;
            var ux = "UV Index = " + uvIndex;
            $("#uvindex").append(ux);

            if (uvIndex >= 0 && uvIndex < 3) {
                $("#uvindex").css("background-color", "green");
            } else if (uvIndex >= 3 && uvIndex <= 5) {
                $("#uvindex").css("background-color", "orange");
            } else {
                $("#uvindex").css("background-color", "red");
            }

        })
    });

    fetch(forecastUrl).then(function (response) {
        return response.json();
    }).then(function (data) {
        var id = 1;
        $("#date-1").empty();
        $("#date-2").empty();
        $("#date-3").empty();
        $("#date-4").empty();
        $("#date-5").empty();
        $(".icon-1").empty();
        $(".icon-2").empty();
        $(".icon-3").empty();
        $(".icon-4").empty();
        $(".icon-5").empty();
        $("#temperture-1").empty();
        $("#temperture-2").empty();
        $("#temperture-3").empty();
        $("#temperture-4").empty();
        $("#temperture-5").empty();
        $("#humidity-1").empty();
        $("#humidity-2").empty();
        $("#humidity-3").empty();
        $("#humidity-4").empty();
        $("#humidity-5").empty();
        for (i = 0; i < data.list.length; i++) {
            if (data.list[i].dt_txt.indexOf("00:00:00") !== -1) {
                var location = data.list[i].dt_txt.slice(0, 10);
                $(`#date-${id}`).append(location);
                var iconCode = data.list[i].weather[0].icon;
                var iconUrl = "http://openweathermap.org/img/w/" + iconCode + ".png";
                $(`#icon-${id}`).html(`<img src=${iconUrl}>`);
                var temperture = (((data.list[i].main.temp - 273.15) * 1.8) + 32).toString().slice(0, 4);
                var temperturePharse = "Temp = " + temperture + "F";
                $(`#temperture-${id}`).append(temperturePharse);
                var humidity = "Humidity = " + data.list[i].main.humidity + "%";
                $(`#humidity-${id}`).append(humidity);
                id++;
            };
        };

    });
};


function searchHistory() {
    let cities = JSON.parse(localStorage.getItem("cities"));
    for (var i = 0; i < cities.length; i++) {
        var btn = $("<button>");
        btn.text(cities[i]);
        btn.addClass("historybtn");
        $("#history").append(btn);
    };
};

searchHistory();

$("#history").on("click", "button", function (event) {
    event.preventDefault();
    callApi($(this).text());
});
