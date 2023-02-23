// DEPENDENCIES
var cocktailList = $("#cocktail-list");
var searchInput = $("#ing-search");
var searchButEl = $("#search");
var todayCocktail = $("#today-cocktail");
var addIngredientButton = $("#add-ingredient");
var ingredient;
var displayList = $("#display-list");

var dialog = $("#dialog");

// DATA
// add NYC latitude and longitude
var ingredientList = [];
var latNYC = "40.7129";
var lonNYC = "-74.0060";
var hotIngredients = [
  "mint",
  "lime",
  "lemon",
  "orange",
  "coconut",
  "pineapple",
  "watermelon",
  "mango",
  "cucumber",
  "grapefruit",
];
var coldIngredients = [
  "chocolate",
  "maple",
  "cranberry",
  "coffee",
  "honey",
  "port",
  "cream",
  "apple",
  "pear",
];
var springIngredients = [
  "strawberry",
  "lemon",
  "lime",
  "pineapple",
  "cherries",
  "peach",
  "kiwi",
  "oranges",
  "apricot",
  "melon",
];
var summerIngredients = [
  "bananas",
  "blackberries",
  "blueberries",
  "raspberries",
  "tomato",
  "watermelon",
  "lemon",
  "lime",
  "mango",
];
var fallIngredients = ["apple", "cider", "caramel", "cinnamon", "ginger"];
var winterIngredients = [
  "pear",
  "orange",
  "cream",
  "lemon",
  "pomegranate",
  "port",
];
var tempThreshold = 283;

// FUNCTIONS
function checkLocation() {
  var lat;
  var lon;
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        lat = position.coords.latitude;
        lon = position.coords.longitude;
        console.log("allowed");
        getWeather(lat, lon);
      },
      function () {
        lat = latNYC;
        lon = lonNYC;
        console.log("blocked");
        getWeather(lat, lon);
      }
    );
  } else {
  }
}

function getWeather(latitude, longitude) {
  console.log(latitude);
  console.log(longitude);
  fetch(
    "https://api.openweathermap.org/data/2.5/weather?lat=" +
      latitude +
      "&lon=" +
      longitude +
      "&appid=f53b5109b06704799e5260e2dda10bda"
  )
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
      getCocktails(data.main.temp);
    });
}

function getCocktails(temperature) {
  var ingredientA;
  var ingredientB;
  if (Number(temperature) > tempThreshold) {
    var randHot = Math.floor(Math.random() * hotIngredients.length);
    ingredientA = hotIngredients[randHot];
  } else {
    var randCold = Math.floor(Math.random() * coldIngredients.length);
    ingredientA = coldIngredients[randCold];
  }
  var currentMonth = dayjs().month();
  if (currentMonth === 0 || currentMonth === 1 || currentMonth === 2) {
    var randWinter = Math.floor(Math.random() * winterIngredients.length);
    ingredientB = winterIngredients[randWinter];
  } else if (currentMonth === 3 || currentMonth === 4 || currentMonth === 5) {
    var randSpring = Math.floor(Math.random() * springIngredients.length);
    ingredientB = springIngredients[randSpring];
  } else if (currentMonth === 6 || currentMonth === 7 || currentMonth === 8) {
    var randSummer = Math.floor(Math.random() * summerIngredients.length);
    ingredientB = summerIngredients[randSummer];
  } else {
    var randFall = Math.floor(Math.random() * fallIngredients.length);
    ingredientB = fallIngredients[randFall];
  }
  var searchString = ingredientA + ", " + ingredientB;
  console.log(searchString);
  $.ajax({
    method: "GET",
    //Only cocktails containing all listed ingredients will be returned.
    url: "https://api.api-ninjas.com/v1/cocktail?ingredients=" + searchString,
    headers: { "X-Api-Key": "FY5H8mVkxpSV+RQ0ub8Cbg==HmezQ5tZdVLtj20h" },
    contentType: "application/json",
    success: function (result) {
      console.log(result);
      //if no cocktail is found combining the two ingredients, search again with only one ingredient
      if (result.length === 0) {
        $.ajax({
          method: "GET",
          url:
            "https://api.api-ninjas.com/v1/cocktail?ingredients=" + ingredientA,
          headers: { "X-Api-Key": "FY5H8mVkxpSV+RQ0ub8Cbg==HmezQ5tZdVLtj20h" },
          contentType: "application/json",
          success: function (result2) {
            console.log(result2);
            displayCocktailDay(result2);
          },
          error: function ajaxError(jqXHR) {
            console.error("Error: ", jqXHR.responseText);
          },
        });
      } else {
        displayCocktailDay(result);
      }
    },
    error: function ajaxError(jqXHR) {
      console.error("Error: ", jqXHR.responseText);
    },
  });
}
//Function the have the user save their favorite cocktail reciepe
function saveUserFav(data) {
  console.log(data);
  var favoritesList = localStorage.getItem("favoritesList");
  if (!favoritesList) {
    favoritesList = [];
  } else {
    favoritesList = JSON.parse(favoritesList);
  }

  favoritesList.push(data);

  localStorage.setItem("favoritesList", JSON.stringify(favoritesList));
  // event.preventDefault();
  // insert your fav cocktail
  //     var cocktail= cocktailInput.value;
  //    localStorage.setItem('cocktail', cocktail);

  //     window.location.reload();
}

function displayCocktailDay(data) {
  var cocktailRand = Math.floor(Math.random() * data.length);
  var cocktailSelected = data[cocktailRand];
  todayCocktail.children().eq(1).text(cocktailSelected.name);
  todayCocktail.children().eq(2).empty();
  for (i = 0; i < cocktailSelected.ingredients.length; i++) {
    var newLI = $(document.createElement("li"));
    newLI.text(cocktailSelected.ingredients[i]);
    todayCocktail.children().eq(2).append(newLI);
  }
  todayCocktail.children().eq(3).text(cocktailSelected.instructions);
}

function displayResults(data) {
  console.log("hello from displayResults");
  // loop through all entries in cocktail data
  for (i = 0; i < data.length; i++) {
    // create elements needed for cocktail recipe display
    var newCard = $(document.createElement("article"));
    var newTitle = $(document.createElement("p"));
    var newIngredients = $(document.createElement("ul"));
    var newInstructions = $(document.createElement("p"));
    var saveButton = $(document.createElement("button"));

    // set element properties
    newTitle.text(data[i].name);
    saveButton.text("save");
    saveButton.click(function (event) {
      saveUserFav(data);
    });

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
    newCard.append(saveButton);
    // append card onto cocktail list
    cocktailList.append(newCard);
  }
}

function searchCocktails(ingInput) {
  console.log("search");
  $.ajax({
    method: "GET",
    //Only cocktails containing all listed ingredients will be returned.
    url: "https://api.api-ninjas.com/v1/cocktail?ingredients=" + ingInput,
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
}

// USER INTERACTIONS
$("#search").on("click", function (event) {
  event.preventDefault();
  ingredient = searchInput.val();
  for (let i = 0; i < ingredientList.length; i++) {
    if (ingredient === "") {
      ingredient = ingredientList[i];
    } else {
      ingredient = ingredient + ", " + ingredientList[i];
    }
  }
  console.log(ingredient);
  if (ingredient !== "") {
    searchCocktails(ingredient);
  }
});

$("#search-form").on("submit", function (event) {
  event.preventDefault();
  ingredient = searchInput.val();

  for (let i = 0; i < ingredientList.length; i++) {
    if (ingredient === "") {
      ingredient = ingredientList[i];
    } else {
      ingredient = ingredient + ", " + ingredientList[i];
    }
  }
  console.log(ingredient);
  if (ingredient !== "") {
    searchCocktails(ingredient);
  }
});

addIngredientButton.on("click", function (event) {
  event.preventDefault();
  ingredient = searchInput.val();
  addIngredient(ingredient);
  searchInput.val("");
  var ingredientListItem = $(document.createElement("li"));
  ingredientListItem.text(ingredient);
  displayList.append(ingredientListItem);
});

function addIngredient(ingredient) {
  ingredientList.push(ingredient);

  console.log(ingredientList);
}

// INITIALIZATIONS
checkLocation();

//Pop-Up-Message
$(function () {
  $("#dialog").dialog({
    autoOpen: false,
    show: {
      effect: "blind",
      duration: 1000,
    },
    hide: {
      effect: "explode",
      duration: 1000,
    },
  });

  $("#opener").on("click", function () {
    $("#dialog").dialog("open");
  });
});
