const fs = require('fs');

const fileContent = fs.readFileSync('data.json', 'utf-8');
const parsedJsonData = JSON.parse(fileContent);

let recipes = parsedJsonData.recipes || [];

const getRecipiesSize = () => {
    return recipes.length;
}

const areRecipesEmpty = () => {
    if (recipes === null || recipes === undefined || recipes.length <= 0) {
        const error = new Error('Sorry! No Recipes are currently present');
        error.status = 200; // since its due to lack of data
        throw error;
    }
}

function findAllRecipes() {
    areRecipesEmpty();
    return recipes;
}

const findLatestRecipes = size => {
    areRecipesEmpty();

    let locRecipes = recipes;
    locRecipes.sort((a, b) => new Date(a.publishedDate) < new Date(b.publishedDate) ? 1 : -1);
    
    // returns a default array
    if(size === null || size === undefined || size===-1) { 
        if(locRecipes.length > 10) { return locRecipes.slice(0, 10); }
        else { return locRecipes; }
    }

    return locRecipes.slice(0, size);  
}

const findTrendingRecipes = size => {
    areRecipesEmpty();

    let locRecipes = recipes;
    locRecipes.sort((a, b) => calculateListAvg(a.ratingsList) < calculateListAvg(b.ratingsList) ? 1 : -1);

    if(size === null || size === undefined || size===-1) { 
        if(locRecipes.length > 10) { return locRecipes.slice(0, 10); }
        else { return locRecipes; }
    }

    return locRecipes.slice(0, size);
}

const findRecipeById = recipeId => {
    areRecipesEmpty();
        
    const recipe = recipes.find(r => Number(r.recipeId) === Number(recipeId));
    if (recipe === undefined || recipe === null) {
        const error = new Error(`Recipe with the given id : ${recipeId} not found`);
        error.status = 404; // since its due to lack of data
        throw error;
    }

    return recipe;
}

const saveRecipe = recipe => {
    // throws error if validation fails
    validateRecipeData(recipe);

    const recipeToStore = prepareRecipeData(recipe);
    recipes.push(recipeToStore);
    return recipeToStore;
}

const validateRecipeData = data => {
    if(!(data.hasOwnProperty("title"))){
        const error = new Error('Title attribute is missing in the save request');
        error.status = 400;
        throw error;
    }

    if(!(data.hasOwnProperty("sourceBaristaId"))){
        const error = new Error('SourceBaristaId is missing in the save request');
        error.status = 400;
        throw error;
    }

    if(!(data.hasOwnProperty("sourceBarista"))){
        const error = new Error('SourceBarista is missing in the save request');
        error.status = 400;
        throw error;
    }

    // TODO: Need to check if any additional validation is needed here
}

// prepares Recipe data to be stored in array/database
const prepareRecipeData = data => {
    return {
        recipeId : (data.recipeId && data.recipeId > getRecipiesSize()) ? data.recipeId : getRecipiesSize() + 1,
        title : data.title,
        sourceBaristaId : data.sourceBaristaId,
        sourceBarista : data.sourceBarista,
        description : data.description || null,
        currentRating : data.currentRating || null,
        imageUrl : data.imageUrl || null,
        timeToMake : data.timeToMake || null,
        brewType : data.brewType || null,
        publishedDate : new Date().toISOString(),
        calories : data.calories || null,
        ingredients : data.ingredients || [],
        labels : data.labels || [],
        ratingsList : data.ratingsList || [],
        intakeAmount : data.intakeAmount || null,
        caffineAmountLabel : data.caffineAmountLabel || null,
        instructions : data.instructions || []
    }
}

const updateRecipe = (recipeId, recipeBody) => {
    const recipeIndex = recipes.findIndex(r => r.recipeId === recipeId);
    if(recipeIndex === -1){
        const error = new Error(`Recipe with id : ${recipeId} not found.`);
        error.status = 404;
        throw error;
    }

    recipeBody.id = recipeId;
    recipes[recipeIndex] = recipeBody;
    return recipeBody;
} 

const deleteRecipeById = recipeId => {
    const recipeIndex = recipes.findIndex(r => r.recipeId === recipeId);
    if(recipeIndex === -1) {
        const error = new Error(`Recipe with id : ${recipeId} not found.`);
        error.status = 404;
        throw error;
    }

    return recipes.splice(recipeIndex, 1);
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