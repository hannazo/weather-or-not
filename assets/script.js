//WHEN I search for a city
//THEN I am presented with current and future conditions for that city 
//and that city is added to the search history

//WHEN I view current weather conditions for that city
//THEN I am presented with the city name, the date, an icon representation of weather conditions, 
//the temperature, the humidity, and the the wind speed

var apiKey = "3eb1248125a6e25b2830cf71a1b124f9";
var cityName;

localStorage.clear();

function getWeather() {
    console.log("City name: " + cityName);

    saveToLocalStorage(cityName)
    populateSearchHistory(cityName)

    var requestUrlWeather = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=metric&appid=" + apiKey;

    var today = dayjs();

    fetch(requestUrlWeather)
        .then(function (response) {
            if (response.status === 200) {
                console.log("Found " + cityName + " in OpenWeather database");
                response.json()
                    .then(function (data) {
                        console.log(data)
                        // Add current data
                        $('#city-name').text(cityName);
                        $('#weather-icon').attr('src', 'http://openweathermap.org/img/wn/' + data.weather[0].icon + '@2x.png');
                        $('#current-day').text(today.format('MMMM D, YYYY'));
                        $('#temperature').text(data.main.temp + " °C");
                        $('#wind').text(data.wind.speed + " MpS");
                        $('#humidity').text(data.main.humidity + " %");
                        // Get five day forecast
                        getForecast();
                    });
            }
            else {
                console.log("Didn't find " + cityName + " in OpenWeather database");
                window.alert("Unable to find the city you are looking for. Please try again.");
                
            }
        });
}

function getForecast() {
    var requestUrlForecast = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&units=metric&appid=" + apiKey;

    fetch(requestUrlForecast)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            // Add data to each card
            let index = 7;
            $('.forecast').each(function () {
                var newDate = dayjs(data.list[index].dt_txt).format('MMMM D, YYYY');
                console.log("Test: " + newDate);
                $(this).children('.date').text(newDate);
                $(this).children('.icon').attr('src', 'http://openweathermap.org/img/wn/' + data.list[index].weather[0].icon + '@2x.png');
                $(this).children().children().children('.temperature').text(data.list[index].main.temp + " °C");
                $(this).children().children().children('.wind').text(data.list[index].wind.speed + " MpS");
                $(this).children().children().children('.humidity').text(data.list[index].main.humidity + " %");
                index += 8; 
            })
        })
}

function saveToLocalStorage(city) {
    let localStorageData = JSON.parse(localStorage.getItem('city'));

    if (localStorageData === null) {
        localStorageData = [];
        localStorageData.push(city)
    }
    else {
        let presentCity = localStorageData.filter(data => data === city);
        if (presentCity.length === 0) {
            localStorageData.push(city);
        }
    }

    localStorage.setItem('city', JSON.stringify(localStorageData));
}

function populateSearchHistory() {
    $('.search-list').empty();
    let localStorageData = JSON.parse(localStorage.getItem('city'));

    if (localStorageData !== null) {
        for (let i = 0; i < localStorageData.length; i++) {

            $('.search-list').append('<button type="button" onclick="newRequest(event)" class="list-group-item btn btn-success city-name-btn">' + localStorageData[i] + '</button>')
        }
    }
}

// Search button
$('#search-btn').on('click', function (event) {
    event.preventDefault();
    cityName = $('input[name="city-input"]').val();
    getWeather();
    // Clear input field
    $('input[type="text"]').val('');
});

// List button
function newRequest(event) {
    cityName = event.target.textContent;
    console.log('New city name: ' + cityName);
    getWeather();
}
