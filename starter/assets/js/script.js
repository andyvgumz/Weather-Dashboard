
const weatherAPIURL = "https://api.openweathermap.org"
const weatherAPIKey = "ba9a603fe5bc71a41792577416da71ca"
let searchInput = $("search-input");
let searchForm = $("search-form");
let searchHistory = []
let searchHistoryContainer = $("#history");
let forecastContainer = $("#forecast");
let todayContainer = $("#today");


//A function to render the history if needed
function renderSearchHistory(search) {

    searchHistoryContainer.html("");

    for (let i = 0; i < searchHistory.length; i++) {
        let btn = $("<button>");
        btn.attr("type", "button");
        btn.addClass("history-btn btn-history")
        btn.text(searchHistory[i])

        btn.attr("data-search", searchHistory[i])
        searchHistoryContainer.append(btn)
    }
}

function appendSearchHistory(search) {

    if (searchHistory.indexOf(search) !== -1) {
        return
    }
    searchHistory.push(search);

    localStorage.setItem('history', JSON.stringify(searchHistory));
}

function renderCurrentWeather(city, weatherData) {
   let date = dayjs().format("D/M/YYYY");
   let tempC = weatherData["main"] ["temp"];
   let windKph = weatherData["wind"] ["speed"];
   let humidity = weatherData["main"]["humidity"];

   let iconUrl = `https://api.openweathermap.org/img/w/${WeatherData.weather[0].icon}.png`;
   let iconDescription = weatherData.weather[0].description || weatherData[0].main

   let card = $("<div>")
   let cardBody = $("<div>")
   let weatherIcon = $("<img>")

   let heading = $("<h2>")
   let tempEl = $("<p>")
   let windEl = $("<p>")

   let humidityEl = $("<p>")

   card.attr("class", "card");

   cardBody.attr("class", "card-body");

   card.append(cardBody);

   heading.attr("class", "h3 card-title")
   tempEl.attr("class", "card-text")
   windEl.attr("class", "card-text")
   humidityEl.attr("class","card-text");

   heading.text(`${city}(${date})`)
   weatherIcon.attr("src", iconUrl);
   weatherIcon.attr("alt", iconDescription);

   heading.append(weatherIcon);
   tempEl.text(`Tenp ${tempC} C`)
   windEl.text(`Wind ${windKph} KPH`)
   humidityEl.text(`Humidity ${humidity} %`)
   cardBody.append(heading, tempEl, windEl, humidityEl);

   todayContainer.html("");
   todayContainer.append(card);
}

function renderForecast(weatherData){
    let headingCol = $("div");
    let heading = $("<h4>");

    headingCol.attr("class", "col-12");
    heading.text("5 day forecast");
    headingCol.append(heading);

    forecastContainer.html("")

    forecastContainer.append(headingCol);

    let futureForecast = weatherData.filter(function(forecast){
        return forecast.dt_txt.includes("12")
    })

    // console.log(futureForecast);

    for(let i = 0; i <futureForecast.length; i++){
        let iconUrl = `https://api.openweathermap.org/img/w/${futureForecast[i].weather[0].icon}.png`;
        // console.log(iconUrl);
        let iconDescription = futureForecast[i].weather[0].description;
        let tempC = futureForecast[i].main.temp;
        let humidity = futureForecast[i].main.humidity;
        let windKhp = futureForecast[i].wind.speed;

        let col = $("<div>")
        let card = $("<div>")
        let cardBody = $("<div>");
        let cardTitle = $("<h5>");
        let weatherIcon = $("<img>")
        let tempEl = $("<p>")
        let windEl = $("<p>")
        let humidityEl = $("<p>")

        col.append(card);
        card.append(cardBody);
        cardBody.append(cardTitle, weatherIcon, tempEl, windEl, humidityEl);

        col.attr("class", "col-md");
        card.attr("class", "card bg-primary h-100 text-white")
        cardTitle.attr("class", "card-title")
        tempEl.attr("class", "card-text")
        windEl.attr("class", "card-text")
        humidityEl.attr("class", "card-text");

        $("cardTitle").text(dayjs(futureForecast[i].format("D/M/YYYY")));
        weatherIcon.attr("src", iconURL);
        weatherIcon.attr("alt", iconDescription);
        tempEl.text(`Temp ${tempC} C`)
        windEl.text(`Wind ${windKph} KPH`);
        humidityEl.text(`Humidity ${humidity} %`);

        forecastContainer.append(col)

    }
   
}

function fetchWeather(location){
    let lat = location.lat; //test coordinates
    let lon = location.lon;//test coordinates

    let city = location.name

    let queryWeatherURL = `${weatherAPIURL}/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${weatherAPIKey}`;
    console.log(queryWeatherURL)

    $.ajax({
        url: queryWeatherURL,
        method:"GET",
    }).then(function(response){
        renderCurrentWeather(city, response.list[0])
        renderForecast(response.list);
    })
}

function fetchCoord(search) {
    let queryURL = `${weatherAPIURL}/geo/1.0/direct?q=${search}&limit=5&appid=${weatherAPIKey}`
    console.log(queryURL)

    fetch(queryURL, {method: "GET"})
    .then(function (data) {
        return data.json()
    }).then(function (response) {
        console.log(response);
        if (!response[0]) {
            alert("No results found")
        } else {
            appendSearchHistory();
            fetchWeather(response[0]);
        }
    })
}

function initializeHistory(){
    let storedHistory = localStorage.getItem("search-history");
    if(storedHistory){
        searchHistory = JSON.parse(storedHistory);
        }
        renderSearchHistory()
}


function submitSearchForm(event) {

    event.preventDefault();
    let search = searchInput.val().trim()

    fetchCoord(search);
    searchInput.val("");
}

function clickSearchHistory(event){
    if(!$(event.target).hasClass("btn-history")){
        return
    }
    let search = $(event.target).attr("data-search")
    // alert(search)

    featchCoord(search);
    searchInput.val("")

}


initializeHistory();
searchForm.on("submit", submitSearchForm);
searchHistoryContainer.on("click", clickSearchHistory)






// ** START PSEUDO CODE 

// when user searches for a city, clicks search button:
//  - store the user input in a variable
//  - use a fetch api to get the current & future conditions for that city
//  - store that city into local storage
// use the data from fetch to populate in the current-weather container:
//  - name and today's date as M/DD/YYY
//  - temp
//  - wind
//  - humidity
//  - UV index (color coded for favorable(green), moderate(yellow), or severe(red))
// use the data from fetch to populate in the five-day container:
//  - date
//  - an icon representation of weather conditions
//  - the temp
//  - wind speed
//  - humidity
// use data in local.storage to create a button under the <hr> in search area for city history
//  - when you click the button it displays the current and future conditions for that city

// ** END PSEUDO CODE ** //

