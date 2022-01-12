let recipes = [
  {
    recipeId: 1,
    title: "Mocha",
    description: "Sweet. Chocolatey. Mildly Caffinated",
    sourceBarista: "CafeCoffeeDay",
    sourceBaristaId: 101,
    currentRating: 2.67,
    imageUrl: "https://pixabay.com/images/search/nature/",
    timeToMake: 15.0,
    brewType: "Mild brew",
    publishedDate: "2021-12-20T13:16:31.436+00:00",
    calories: 5.87,
    ingredients: ["Coffee", "Sugar", "Water"],
    labels: ["Bitter", "Non-Milk", "Caffinated"],
    ratingsList: [2.5, 2.0, 1.5, 2.5, 1.1, 2.7],
    intakeAmount: 51.1,
    caffineAmountLabel: "MEDIUM",
    instructions: ["First Step", "Second Step", "Third Step", "Fourth Step"],
    bookMarked: false,
  },
  {
    recipeId: 2,
    title: "Cuppachino",
    description: "Sweet. Chocolatey. Low Caffinated, Milky",
    sourceBarista: "Starbucks",
    sourceBaristaId: 102,
    currentRating: 2.67,
    imageUrl: "https://pixabay.com/images/search/nature/",
    timeToMake: 15.0,
    brewType: "Mild brew",
    publishedDate: "2021-12-26T13:16:31.436+00:00",
    calories: 5.87,
    ingredients: ["Coffee", "Sugar", "Milk"],
    labels: ["Bitter", "Milk", "Caffinated"],
    ratingsList: [2.5, 3.0, 2.5, 3.5, 3.1, 2.7],
    intakeAmount: 51.1,
    caffineAmountLabel: "MEDIUM",
    instructions: ["First Step", "Second Step", "Third Step", "Fourth Step"],
    bookMarked: false,
  },
  {
    recipeId: 3,
    title: "Americano",
    description: "Sweet. Chocolatey. Highly Caffinated",
    sourceBarista: "COSTA",
    sourceBaristaId: 103,
    currentRating: 2.67,
    imageUrl: "https://pixabay.com/images/search/nature/",
    timeToMake: 15.0,
    brewType: "Strong brew",
    publishedDate: "2021-12-30T13:16:31.436+00:00",
    calories: 5.87,
    ingredients: ["Coffee", "Sugar", "Water"],
    labels: ["Bitter", "Non-Milk", "Caffinated"],
    ratingsList: [4.5, 4.0, 3.5, 3.5, 4.1, 4.7],
    intakeAmount: 51.1,
    caffineAmountLabel: "MEDIUM",
    instructions: ["First Step", "Second Step", "Third Step", "Fourth Step"],
    bookMarked: false,
  }
];

let recipesSize = 3;

const getRecipiesSize = () => recipes.length;

const findAllRecipes = () => {
    return recipes;
}

const findRecipeById = recipeId => {
    for(let recipeIndex in recipes){
        const recipe = recipes[recipeIndex];
        if(recipe.recipeId === recipeId){
            return recipe;
        }
    }
    return null;
}

const saveRecipe = recipe => {
    recipe['recipeId'] = ++recipesSize;
    recipes.push(recipe);
    return recipe;
}

const updateRecipeById = (recipeId, updatedRecipe) => {
    for(let recipeIndex in recipes){
        const recipe = recipes[recipeIndex];
        if(recipe.recipeId === recipeId){
            recipes[recipeIndex] = updatedRecipe;
            return recipes[recipeIndex];
        }
    }
    return null;
}

const deleteRecipeById = recipeId => {
    for(let recipeIndex in recipes){
        if(recipes[recipeIndex].recipeId === recipeId){
            return recipes.splice(recipeIndex, 1);
        }
    }
    return null;
}

const findLatestRecipes = size => {
    let locRecipes = recipes;
    locRecipes.sort((a, b) => new Date(a.publishedDate) < new Date(b.publishedDate) ? 1 : -1);
    
    if(size === null || size === undefined) { return []; }

    if(size !== -1) { return locRecipes.slice(0, size); }
        
    if(locRecipes.length > 10) { return locRecipes.slice(0, 10); }
    else { return locRecipes; }
}

const findTrendingRecipes = size => {
    let locRecipes = recipes;
    locRecipes.sort((a, b) => calculateListAvg(a.ratingsList) < calculateListAvg(b.ratingsList) ? 1 : -1);

    if(size === null || size === undefined) { return []; }

    if(size !== -1) { return locRecipes.slice(0, size); }
        
    if(locRecipes.length > 10) { return locRecipes.slice(0, 10); }
    else { return locRecipes; }
}

const calculateListAvg = list => list.reduce((a, b) => a+b) / list.length;

module.exports = {
    repositoryActions : {
        getRecipiesSize : getRecipiesSize,
        findAllRecipes : findAllRecipes,
        findRecipeById : findRecipeById,
        saveRecipe : saveRecipe,
        updateRecipeById : updateRecipeById,
        deleteRecipeById : deleteRecipeById,
        findLatestRecipes : findLatestRecipes,
        findTrendingRecipes : findTrendingRecipes
    }
}


/* =======================           TESTING ZONE               ============================== */

