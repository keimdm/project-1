// DEPENDENCIES
var cocktailList = $("#cocktail-list");

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
    // loop through all entries in cocktail data
    for (i = 0; i < data.length; i++) {
        // create elements needed for cocktail recipe display
        var newCard = $(document.createElement("article"));
        var newIngredients = $(document.createElement("ul"));
        var newInstructions = $(document.createElement("p"));  
        // loop through all ingredient entries and add them to new Ingredients list  
        for (j = 0; j < data[i].ingredients.length; j++) {
            newItem = $(document.createElement("li"));
            newItem.text(data[i].ingredients[j]);
            newIngredients.append(newItem);
        }
        // append elements onto card
        newInstructions.text(data[i].instructions);
        newCard.append(newIngredients);
        newCard.append(newInstructions);
        // append card onto cocktail list
        cocktailList.append(newCard);
    }
}

// USER INTERACTIONS

// INITIALIZATIONS
getWeather(latNYC, lonNYC);