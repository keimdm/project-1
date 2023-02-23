// DEPENDENCIES
var cocktailList = $("#cocktail-list");
var searchInput = $("#ing-search");
var searchButEl = $("#search");
var ingredient;

$("#search").on("click", function (event) {
  event.preventDefault();
  ingredient = searchInput.val();
  console.log(ingredient);
  $.ajax({
    method: "GET",
    //Only cocktails containing all listed ingredients will be returned.
    url: "https://api.api-ninjas.com/v1/cocktail?ingredients=" + ingredient,
    headers: { "X-Api-Key": "FY5H8mVkxpSV+RQ0ub8Cbg==HmezQ5tZdVLtj20h" },
    contentType: "application/json",
    success: function (result) {
      console.log(result);
      cocktailList.empty();
      displayResults(result);
    },
    error: function ajaxError(jqXHR) {
      console.error("Error: ", jqXHR.responseText);
    },
  });
});

// DATA
// add NYC latitude and longitude
var latNYC = "40.7129";
var lonNYC = "-74.0060";


// FUNCTIONS
function getWeather() {
    var lat;
    var lon;
    if ('geolocation' in Navigator) {
        navigator.geolocation.getCurrentPosition(function (position) {
            lat=position.coords.latitude;
            lon=position.coords.longitude;
        });
    }
    else {
         lat=latNYC;
         lon=lonNYC;
    }
fetch(
    "https://api.openweathermap.org/data/2.5/weather?lat=" +
      lat +
      "&lon=" +
      lon +
      "&appid=f53b5109b06704799e5260e2dda10bda"
  )
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
  if (Number(temperature) > 283) {
    ingredients = hotSearch;
  } else {
    ingredients = coldSearch;
  }
  $.ajax({
    method: "GET",
    //Only cocktails containing all listed ingredients will be returned.
    url: "https://api.api-ninjas.com/v1/cocktail?ingredients=" + ingredients,
    headers: { "X-Api-Key": "FY5H8mVkxpSV+RQ0ub8Cbg==HmezQ5tZdVLtj20h" },
    contentType: "application/json",
    success: function (result) {
      console.log(result);
      displayResults(result);
    },
    error: function ajaxError(jqXHR) {
      console.error("Error: ", jqXHR.responseText);
    },
  });
}

function displayResults(data) {
  // loop through all entries in cocktail data
  for (i = 0; i < data.length; i++) {
    // create elements needed for cocktail recipe display
    var newCard = $(document.createElement("article"));
    var newTitle = $(document.createElement("p"));
    var newIngredients = $(document.createElement("ul"));
    var newInstructions = $(document.createElement("p"));
    // set element properties
    newTitle.text(data[i].name);
    // loop through all ingredient entries and add them to new Ingredients list
    for (j = 0; j < data[i].ingredients.length; j++) {
      newItem = $(document.createElement("li"));
      newItem.text(data[i].ingredients[j]);
      newIngredients.append(newItem);
    }
    newInstructions.text(data[i].instructions);
    // append elements onto card
    newCard.append(newTitle);
    newCard.append(newIngredients);
    newCard.append(newInstructions);
    // append card onto cocktail list
    cocktailList.append(newCard);
  }
}

// USER INTERACTIONS

// INITIALIZATIONS
getWeather(latNYC, lonNYC);
