// DEPENDENCIES
var cocktailList = $("#cocktail-list");
var name = 'bloody mary'
$.ajax({
    method: 'GET',
    url: 'https://api.api-ninjas.com/v1/cocktail?name=' + name,
    headers: { 'X-Api-Key': 'FY5H8mVkxpSV+RQ0ub8Cbg==HmezQ5tZdVLtj20h'},
    contentType: 'application/json',
    success: function(result) {
        console.log(result);
    },
    error: function ajaxError(jqXHR) {
        console.error('Error: ', jqXHR.responseText);
    }
});

fetch('https://api.openweathermap.org/data/2.5/weather?q=location&appid=32306f990946c772c9c7ada42e2ab47f')
.then(response => {
    return response.json();
})
.then(data => {
    console.log(data);
});

// DATA
// add NYC latitude and longitude
var latNYC = 0;
var lonNYC = 0;
var hotSearch = "lemon";
var coldSearch = "cream";

// FUNCTIONS
function getWeather(lat, lon) {

}

function getCocktails(temperature) {

}

function displayResults(data) {

}

// USER INTERACTIONS

// INITIALIZATIONS
getWeather(latNYC, lonNYC);