const fs = require('fs');

const fileContent = fs.readFileSync('data.json', 'utf-8');
const parsedJsonData = JSON.parse(fileContent);

let recipes = parsedJsonData.recipes;
let recipesSize = recipes.length;

function getRecipiesSize() {
    return recipes.length;
}

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

const updateRecipe = (recipeId, recipeBody) => {
    if(recipeId === undefined || recipeId === null)
        return null;

    if(recipeBody === undefined || recipeBody === null)
        return null;

    const recipeIndex = recipes.findIndex(r => r.recipeId === recipeId);
    if(recipeIndex === -1){
        return null;
    }

    recipeBody.id = recipeId;
    recipes[recipeIndex] = recipeBody;
    return recipeBody;
} 

const deleteRecipeById = recipeId => {
    const recipeIndex = recipes.findIndex(r => r.recipeId === recipeId);
    if(recipeIndex === -1)
        return null;

    return recipes.splice(recipeIndex, 1);
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
        deleteRecipeById : deleteRecipeById,
        findLatestRecipes : findLatestRecipes,
        findTrendingRecipes : findTrendingRecipes,
        updateRecipe : updateRecipe
    }
}


/* =======================           TESTING ZONE               ============================== */

