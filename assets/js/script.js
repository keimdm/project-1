// DEPENDENCIES
var cocktailList = $("#cocktail-list");
var searchInput = $("#ing-search");
var searchButEl = $("#search");
var todayCocktail = $("#today-cocktail");
var favoritesDiv = $("#favorites-list");
var ingredient;
var displayList = $("#display-list");
var dialog = $("#dialog");
var favoritesButton = $("#favorites-button");
var addIngredientButton = $("#add-ingredient");

// DATA
var ingredientList = [];
var tempWord;
// Coordinates of NYC to use as default
var latNYC = "40.7129";
var lonNYC = "-74.0060";
// hot weather appropriate ingredients
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
// cold weather appropriate ingredients
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
// spring seasonal ingredients
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
// summer seasonal ingredients
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
// fall seasonal ingredients
var fallIngredients = ["apple", "cider", "caramel", "cinnamon", "ginger"];
// winter seasonal ingredients
var winterIngredients = [
  "pear",
  "orange",
  "cream",
  "lemon",
  "pomegranate",
  "port",
];
// list of common cocktail ingredients and respective number of syllables for haiku generations
var commonIngredientsDict = [
  ["pear", 1],
  ["orange", 2],
  ["cream", 1],
  ["lemon", 2],
  ["port", 1],
  ["banana", 3],
  ["blackberries", 3],
  ["blackberry", 3],
  ["blueberries", 3],
  ["blueberry", 3],
  ["raspberries", 3],
  ["raspberry", 3],
  ["tomato", 3],
  ["lemon", 2],
  ["lime", 1],
  ["mango", 2],
  ["apple", 2],
  ["cider", 2],
  ["caramel", 3],
  ["cinnamon", 3],
  ["ginger", 2],
  ["strawberry", 3],
  ["lemon", 2],
  ["lime", 1],
  ["pineapple", 3],
  ["cherries", 2],
  ["cherry", 2],
  ["peach", 1],
  ["kiwi", 2],
  ["oranges", 3],
  ["apricot", 3],
  ["melon", 2],
  ["mint", 1],
  ["lime", 1],
  ["lemon", 2],
  ["orange", 2],
  ["coconut", 3],
  ["pineapple", 3],
  ["mango", 2],
  ["cucumber", 3],
  ["grapefruit", 2],
  ["chocolate", 3],
  ["maple", 2],
  ["cranberry", 3],
  ["coffee", 2],
  ["honey", 2],
  ["port", 1],
  ["cream", 1],
  ["apple", 2],
  ["pear", 1],
  ["gin", 1],
  ["rye", 1],
  ["whiskey", 2],
  ["whisky", 2],
  ["scotch", 1],
  ["rum", 1],
  ["vodka", 2],
  ["wine", 1],
  ["vermouth", 2],
  ["water", 2],
  ["syrup", 2],
  ["bitters", 2],
  ["sherry", 2],
  ["absinthe", 2],
  ["brandy", 2],
  ["soda", 2],
  ["tonic", 2],
  ["seltzer", 2],
  ["grenadine", 3],
  ["zest", 1],
  ["cognac", 2],
  ["creme", 1],
  ["pineapple", 3],
  ["tequila", 3],
  ["mezcal", 2],
];
// list of months with respective syllables + 1 for haiku generation (the +1 accomodates the filler words)
var monthsDict = [
  ["January", 5],
  ["February", 5],
  ["March", 2],
  ["April", 3],
  ["May", 2],
  ["June", 2],
  ["July", 3],
  ["August", 3],
  ["September", 4],
  ["October", 4],
  ["November", 4],
  ["December", 4],
];
var commonIngredients = [];
var months = [];
var tempThreshold = 283;
var haikuWords = [];
var haikuDictionary = [];
var haikuStructure = [
  (firstLine = {
    words: [],
    syllables: 0,
    max: 5,
  }),
  (secondLine = {
    words: [],
    syllables: 0,
    max: 7,
  }),
  (thirdLine = {
    words: [],
    syllables: 0,
    max: 5,
  }),
];

// FUNCTIONS
// gets user location using geolocation API in browser, to feed into Weather API
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
      // if blocked, it uses the coordinates of NYC
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

// gets weather for given lat and lon - passes temperature data to be interpreted in getCocktails function
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

// interprets temperature as either warm or cool, looks at season to create list of two search terms for cocktail API
function getCocktails(temperature) {
  var ingredientA;
  var ingredientB;
  if (Number(temperature) > tempThreshold) {
    var randHot = Math.floor(Math.random() * hotIngredients.length);
    ingredientA = hotIngredients[randHot];
    tempWord = "warm";
  } else {
    var randCold = Math.floor(Math.random() * coldIngredients.length);
    ingredientA = coldIngredients[randCold];
    tempWord = "cold";
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
  //list of possible haiku words includes the ingredients search terms and the month
  haikuWords.push(dayjs().format("MMMM"));
  addEntry(dayjs().format("MMMM"));
  haikuWords.push(ingredientA);
  addEntry(ingredientA);
  console.log(searchString);
  // cocktail API query
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
        // if two ingredient query was successful, also add ingredient 2 to possible haiku words
        haikuWords.push(ingredientB);
        addEntry(ingredientB);
        displayCocktailDay(result);
      }
    },
    error: function ajaxError(jqXHR) {
      console.error("Error: ", jqXHR.responseText);
    },
  });
}
//Function the have the user save their favorite cocktail reciepe
function saveUserFav(target) {
  console.log(target);
  var parent = $(target).parent();
  var favoritesList = localStorage.getItem("favoritesList");
  if (!favoritesList) {
    favoritesList = [];
  } else {
    favoritesList = JSON.parse(favoritesList);
  }
  var newIngredients = [];
  console.log(parent.children());
  for (i = 0; i < parent.children().eq(1).children().length; i++) {
    newIngredients.push(parent.children().eq(1).children().eq(i).text());
  }
  var newEntry = {
    title: parent.children().eq(0).text(),
    ingredients: newIngredients,
    instructions: parent.children().eq(2).text(),
  };
  console.log(newEntry);

  favoritesList.push(newEntry);

  localStorage.setItem("favoritesList", JSON.stringify(favoritesList));
}

// displays user favorited cocktails on the screen
function displayFavoritesList() {
  //get the data from localStorage-it's an array
  var favoritesList = localStorage.getItem("favoritesList");
  console.log(favoritesList);
  console.log(localStorage);
  if (!favoritesList) {
    favoritesList = [];
  } else {
    favoritesList = JSON.parse(favoritesList);
  }
  //go through each item in a favorite list
  console.log(favoritesList);
  for (var i = 0; i < favoritesList.length; i++) {
    console.log(favoritesList[i]);
    var newCard = $(document.createElement("article"));
    newCard.addClass("result");
    var title = $(document.createElement("p"));
    title.text(favoritesList[i].title);
    newCard.append(title);
    var list = $(document.createElement("ul"));
    for (var k = 0; k < favoritesList[i].ingredients.length; k++) {
      var paragraph = $(document.createElement("li"));
      paragraph.text(favoritesList[i].ingredients[k]);
      list.append(paragraph);
    }
    newCard.append(list);
    var instructions = $(document.createElement("p"));
    instructions.text(favoritesList[i].instructions);
    newCard.append(instructions);
    favoritesDiv.append(newCard);
  }
}

// displays cocktail of the day on the screen
function displayCocktailDay(data) {
  var cocktailRand = Math.floor(Math.random() * data.length);
  var cocktailSelected = data[cocktailRand];
  todayCocktail.children().eq(3).text(cocktailSelected.name);
  todayCocktail.children().eq(4).empty();
  for (i = 0; i < cocktailSelected.ingredients.length; i++) {
    var newLI = $(document.createElement("li"));
    newLI.text(cocktailSelected.ingredients[i]);
    todayCocktail.children().eq(4).append(newLI);
  }
  todayCocktail.children().eq(5).text(cocktailSelected.instructions);
  makeHaikuList(cocktailSelected);
}

// Adds entry to the haiku dictionary - including the word, the number of syllables and the type of word (either noun or month)
function addEntry(word) {
  console.log(word);
  var syllables = 0;
  var type = "";
  try {
    syllables = commonIngredientsDict[commonIngredients.indexOf(word)][1];
    type = "noun";
  } catch {
    syllables = monthsDict[months.indexOf(word)][1];
    type = "month";
  }
  var newEntry = {
    haikuWord: word,
    wordSyllables: syllables,
    wordType: type,
  };
  haikuDictionary.push(newEntry);
}

// creates a list listing only the word (without the syllable number) from the commonIngredientsDict and monthsDict listed above
function setUpLists() {
  for (i = 0; i < commonIngredientsDict.length; i++) {
    commonIngredients.push(commonIngredientsDict[i][0]);
  }
  for (i = 0; i < monthsDict.length; i++) {
    months.push(monthsDict[i][0]);
  }
  console.log(commonIngredients);
  console.log(months);
}

// creates a list of 8 words adding on to what was added to the list above - ingredients A and B, and the month
function makeHaikuList(data) {
  //looks for more possible ingredients to include in the haiku in the recipe, by breaking out each ingredient line into individual words
  for (i = 0; i < data.ingredients.length; i++) {
    var ingredientLine = data.ingredients[i].split(" ");
    for (j = 0; j < ingredientLine.length; j++) {
      var word = ingredientLine[j].toLowerCase();
      if (commonIngredients.includes(word) && haikuWords.length < 8) {
        haikuWords.push(word);
        addEntry(word);
      }
      if (
        // removes commas which can give a false negative
        commonIngredients.includes(word.slice(0, word.length - 1)) &&
        haikuWords.length < 8
      ) {
        haikuWords.push(word.slice(0, word.length - 1));
        addEntry(word.slice(0, word.length - 1));
      }
    }
  }
  // repeat some words if needed until there are 8 - except for the month, which can only occur once
  while (haikuWords.length < 8) {
    for (k = 0; k < haikuWords.length; k++) {
      if (!months.includes(haikuWords[k]) && haikuWords.length < 8) {
        haikuWords.push(haikuWords[k]);
      }
    }
  }
  console.log(haikuWords);
  console.log(haikuDictionary);
  makeHaiku();
}

// allocates words from haikuWords to three lines without going over the number of syllables, until a max of 3 are left in each line
function makeHaiku() {
  testDone = false;
  while (testDone === false) {
    for (i = 0; i < haikuDictionary.length; i++) {
      randLine = Math.floor(Math.random() * haikuStructure.length);
      if (
        Number(haikuStructure[randLine].syllables) +
          haikuDictionary[i].wordSyllables <=
        haikuStructure[randLine].max
      ) {
        haikuStructure[randLine].words.push(haikuDictionary[i].haikuWord);
        haikuStructure[randLine].syllables =
          haikuStructure[randLine].syllables + haikuDictionary[i].wordSyllables;
        if (months.includes(haikuDictionary[i].haikuWord)) {
          haikuDictionary.splice(i, 1);
        }
      }
    }
    testDone = true;
    for (i = 0; i < haikuStructure.length; i++) {
      if (Number(haikuStructure[i].syllables) + 3 < haikuStructure[i].max) {
        testDone = false;
      }
    }
  }
  console.log(haikuStructure);
  // the month should be the last word in whatever line it's in
  for (i = 0; i < haikuStructure.length; i++) {
    var monthCheck = false;
    var monthIndex = -1;
    for (j = 0; j < haikuStructure[i].words.length; j++) {
      if (months.includes(haikuStructure[i].words[j])) {
        monthCheck = true;
        monthIndex = j;
      }
    }
    if (monthCheck) {
      var placeholder =
        haikuStructure[i].words[haikuStructure[i].words.length - 1];
      haikuStructure[i].words[haikuStructure[i].words.length - 1] =
        haikuStructure[i].words[monthIndex];
      haikuStructure[i].words[monthIndex] = placeholder;
      var difference = haikuStructure[i].max - haikuStructure[i].syllables;
      // add filler words to fill in remaining syllables
      if (difference === 0) {
        haikuStructure[i].words.splice(
          haikuStructure[i].words.length - 1,
          0,
          "in"
        );
      }
      if (difference === 1) {
        haikuStructure[i].words.splice(
          haikuStructure[i].words.length - 1,
          0,
          "in " + tempWord
        );
      }
      if (difference === 2) {
        haikuStructure[i].words.splice(
          haikuStructure[i].words.length - 1,
          0,
          "in this " + tempWord
        );
      }
    } else {
      var difference2 = haikuStructure[i].max - haikuStructure[i].syllables;
      if (difference2 === 1) {
        if (haikuStructure[i].words.length === 1) {
          haikuStructure[i].words.splice(
            haikuStructure[i].words.length - 1,
            0,
            "some"
          );
        } else {
          haikuStructure[i].words.splice(
            haikuStructure[i].words.length - 1,
            0,
            "and"
          );
        }
      }
      if (difference2 === 2) {
        if (haikuStructure[i].words.length === 1) {
          haikuStructure[i].words.splice(
            haikuStructure[i].words.length - 1,
            0,
            "some " + tempWord
          );
        } else {
          haikuStructure[i].words.splice(
            haikuStructure[i].words.length - 1,
            0,
            "and"
          );
          haikuStructure[i].words.unshift("some");
        }
      }
      if (difference2 === 3) {
        if (haikuStructure[i].words.length === 1) {
          haikuStructure[i].words.splice(
            haikuStructure[i].words.length - 1,
            0,
            "some " + tempWord + ", " + tempWord
          );
        } else {
          haikuStructure[i].words.splice(
            haikuStructure[i].words.length - 1,
            0,
            "and some"
          );
          haikuStructure[i].words.unshift("some");
        }
      }
    }
  }
  var finishedPoem = ["", "", ""];
  // add commas/formatting
  for (i = 0; i < haikuStructure.length; i++) {
    for (j = 0; j < haikuStructure[i].words.length; j++) {
      var nextWord = haikuStructure[i].words[j];
      if (
        commonIngredients.includes(nextWord) &&
        j !== haikuStructure[i].words.length - 1
      ) {
        nextWord = nextWord + ",";
      }
      finishedPoem[i] = finishedPoem[i] + " " + nextWord;
    }
    if (i !== 2) {
      finishedPoem[i] = finishedPoem[i] + ",";
    }
  }
  console.log(finishedPoem);
  displayHaiku(finishedPoem);
}

// display haiku on screen in the info button
function displayHaiku(text) {
  for (i = 0; i < text.length; i++) {
    var newP = $(document.createElement("p"));
    newP.text(text[i]);
    newP.addClass("newP");
    dialog.append(newP);
  }
}

// displays cocktail search results
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
    newCard.addClass("result");
    saveButton.text("add to favorites +");
    saveButton.addClass("cardButtons");

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

// runs API query on ingredient search terms input by user
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

// adds searched ingredient to list (called by click event)
function addIngredient(ingredient) {
  ingredientList.push(ingredient);
  console.log(ingredientList);
}

// USER INTERACTIONS
// search button click event
$("#search").on("click", function (event) {
  event.preventDefault();
  todayCocktail.hide();
  favoritesDiv.hide();
  cocktailList.show();
  ingredient = searchInput.val();
  // adds any ingredients in list to search term
  for (i = 0; i < ingredientList.length; i++) {
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

// event for pressing enter in the search bar
$("#search-form").on("submit", function (event) {
  event.preventDefault();
  todayCocktail.hide();
  favoritesDiv.hide();
  cocktailList.show();
  ingredient = searchInput.val();
  for (i = 0; i < ingredientList.length; i++) {
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
// click event for save button
cocktailList.click("button", function (event) {
  saveUserFav(event.target);
  console.log("savebutton");
});
// click event to display favorites
favoritesButton.on("click", function (event) {
  event.preventDefault();
  favoritesDiv.show();
  todayCocktail.hide();
  cocktailList.hide();
});
// click event to add ingredient to list
addIngredientButton.on("click", function (event) {
  event.preventDefault();
  ingredient = searchInput.val();
  addIngredient(ingredient);
  searchInput.val("");
  var ingredientListItem = $(document.createElement("li"));
  ingredientListItem.text(ingredient);
  displayList.append(ingredientListItem);
});

// click event to clear list
$("#clear").on("click", function () {
  console.log("clear");
  ingredientList = [];
  displayList.empty();
});

// INITIALIZATIONS
favoritesDiv.hide();
displayFavoritesList();
setUpLists();
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
    closeText: "",
  });

  $("#opener").on("click", function () {
    $("#dialog").dialog("open");
  });
});

//Help Button
$(function () {
  $("#helpButton").dialog({
    autoOpen: false,
    show: {
      effect: "blind",
      duration: 1000,
    },
    hide: {
      effect: "explode",
      duration: 1000,
    },
    closeText: "",
  });

  $("#help-button").on("click", function () {
    $("#helpButton").dialog("open");
  });
});
