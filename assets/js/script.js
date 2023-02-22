// DEPENDENCIES
var cocktailList = $("#cocktail-list");


// DATA
// add NYC latitude and longitude
var latNYC = '40.7129';
var lonNYC = '-74.0060';
var hotSearch = "lemon";
var coldSearch = "chocolate";

// FUNCTIONS
function getWeather(lat,lon) {
    fetch('https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&appid=f53b5109b06704799e5260e2dda10bda')
.then(response => {
    return response.json();
})
.then(data => {
    console.log(data);
    getCocktails(data.main.temp);
});

}

function getCocktails(temperature) {
    var ingredients;
    if (Number(temperature)>283){
        ingredients=hotSearch;
    }
    else {
        ingredients=coldSearch;
    }
$.ajax({
    method: 'GET',
    //Only cocktails containing all listed ingredients will be returned.
    url: 'https://api.api-ninjas.com/v1/cocktail?ingredients=' + ingredients,
    headers: { 'X-Api-Key': 'FY5H8mVkxpSV+RQ0ub8Cbg==HmezQ5tZdVLtj20h'},
    contentType: 'application/json',
    success: function(result) {
        console.log(result);
        displayResults(result);
    },
    error: function ajaxError(jqXHR) {
        console.error('Error: ', jqXHR.responseText);
    } 
});

}

function displayResults(data) {

}

// USER INTERACTIONS

// INITIALIZATIONS
getWeather(latNYC, lonNYC);