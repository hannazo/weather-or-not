$(function () {

    //WHEN I search for a city
    //THEN I am presented with current and future conditions for that city 
    //and that city is added to the search history
    $('#search-btn').on('click', function (event) {
        event.preventDefault();

        var apiKey = "3eb1248125a6e25b2830cf71a1b124f9";
        var cityName = $('input[name="city-input"]').val();
        console.log("Searching for: " + cityName);

        var requestUrlWeather = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=metric&appid=" + apiKey;
        var requestUrlForecast = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&units=metric&appid=" + apiKey;

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
                            $('#current-day').text(today.format('MMMM D, YYYY'));
                            $('#temperature').text(data.main.temp + " °C");
                            $('#wind').text(data.wind.speed + " MpS");
                            $('#humidity').text(data.main.humidity + " %");
                            // Get five day forecast
                            getForecast();
                            // Add button to "Past Searches"
                            $('.search-list').append('<button type="button" class="list-group-item btn btn-success">' + cityName + '</button>')
                        });
                }
                else {
                    console.log("Didn't find " + cityName + " in OpenWeather database");
                    window.alert("Unable to find the city you are looking for. Please try again.");
                }
            });

        function getForecast() {
            fetch(requestUrlForecast)
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    console.log(data);
                    // Add data to each card
                    $('.forecast').each(function () {
                        var cardId = $(this).attr('id').split('card-')[1];
                        console.log(cardId);
                        $(this).children().children().children('.temperature').text(data.list[cardId].main.temp + " °C");
                        $(this).children().children().children('.wind').text(data.list[cardId].wind.speed + " MpS");
                        $(this).children().children().children('.humidity').text(data.list[cardId].main.humidity + " %");
                    })
                })
        }
        
        // Clear input field
        $('input[type="text"]').val('');
    });

})