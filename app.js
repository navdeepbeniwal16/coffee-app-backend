const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');

const { repositoryActions } = require('./recipe-repository');

app.use(bodyParser.json());
app.use(morgan('dev'));

const isEmptyObject = obj => obj === null || Object.keys(obj).length === 0;

// Recipe Routes

app.get('/recipes', (req, res, next) => {
    try {
        const recipes = repositoryActions.findAllRecipes();
        const response = prepareSuccessResonse('recipes',recipes);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
});

// handler to get recipes in the order - lastest to oldest
app.get('/recipes/latest', (req, res, next) => {
    try {
        const queryDataSize = req.query.size || -1; // -1 a is default value
        const recipes = repositoryActions.findLatestRecipes(queryDataSize);
        const response = prepareSuccessResonse('recipes',recipes);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    } 
});

// handler to get recipes in the order - highest average rating to lowest average rating
app.get('/recipes/trending', (req, res, next) => {
    try {
        const queryDataSize = req.query.size ? req.query.size : -1; // -1 is default value to fetch all the recipes
        const recipes = repositoryActions.findTrendingRecipes(queryDataSize);
        const response = prepareSuccessResonse('recipes',recipes);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
});

app.get('/recipes/:id', (req, res, next) => {
    const recipeId = Number(req.params.id);

    if (Number.isNaN(recipeId)) {
        const error = new Error('Recipe id is invalid.');
        error.status = 404;
        return next(error);
    }

    try {
        const recipe = repositoryActions.findRecipeById(recipeId);
        const response = prepareSuccessResonse('recipe', recipe)
        res.status(200).send(response);
    } catch (error) {
        next(error);
    }
});

app.post('/recipes', (req, res, next) => {
    const recipeData = req.body;
    
    if(recipeData === undefined || recipeData === null || isEmptyObject(recipeData)) {
        const error = new Error('Recipe data sent is invalid');
        error.status = 400;
        return next(error);
    }
        
    try {
        const savedRecipe =repositoryActions.saveRecipe(recipeData);
        return res.status(201).send(savedRecipe);
    } catch (error) {
        next(error);
    }
});

app.put('/recipes/:id', (req, res, next) => {
    const recipeId = Number(req.params.id);
    const recipeBody = req.body;

    if(Number.isNaN(recipeId)) {
        let error = new Error("RecipeId is invalid");
        error.status = 404;
        return next(error);
    }

    if(isEmptyObject(recipeBody)){
        console.log(recipeBody);
        let error = new Error("Recipe body is invalid");
        error.status = 400;
        return next(error);
    }

    try {
        const updatedRecipe = repositoryActions.updateRecipe(recipeId, recipeBody);
        res.status(200).send(updatedRecipe);
    } catch (error) {
        next(error)
    }
});

app.delete('/recipes/:id', (req, res, next) => {
    const recipeId = Number(req.params.id);

    if(Number.isNaN(recipeId)){
        let error = new Error("RecipeId is invalid");
        error.status = 404;
        return next(error);
    }

    try {
        const deletedRecipe = repositoryActions.deleteRecipeById(recipeId);
        res.status(200).send(deletedRecipe);
    } catch (error) {
        return next(error)
    }
});

app.use((err, req, res, next) => {
    const status = err.status || 500;
    const errMsg = err.message || 'Internal server error';
    console.log('Error : ' + errMsg);
    res.status(status).send({
        error : errMsg,
        status : status
    })
})

const prepareSuccessResonse = (title, data) => {
    let size = 0;
    
    if(data instanceof Array){
        size = data.length;
    } else {
        if(data !== null){
            size = 1;
        }
    }
    
    const response = { "size" : size }
    if(title === 'recipes'){
        response['recipes'] = data;
    }
    if(title === 'recipe'){
        response['recipe'] = data;
    }
    return response;
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})