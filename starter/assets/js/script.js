
const weatherAPIURL = "https://api.openweathermap.org"
const weatherAPIKey = "ba9a603fe5bc71a41792577416da71ca"
let searchInput = $("search-input");
let searchForm = $("search-form");
let searchHistory = []
let searchHistoryContainer = $("#history")

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
        console.log(response);
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


function submitSearchFrom(event) {

    event.preventDefault();
    let search = searchInput.val().trim()

    fetchCoord(search);
    searchInput.val("");
}


initializeHistory();
searchForm.on("submit", submitSearchFrom);






// ** START PSEUDO CODE (subject to change) 

// when user searches for a city (clicks search button):
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

