const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// app.use(express.json());
// app.use(express.urlencoded({extended: true}));
app.use(bodyParser.json());

const { repositoryActions } = require('./recipe-repository');

// Recipes routes

app.get('/recipes', (req, res, next) => {
    const recipes = repositoryActions.findAllRecipes();
    const response = prepareSuccessResonse('recipes',recipes);
    res.status(200).json(response);
});

// handler to get recipies in the order - lastest to oldest
app.get('/recipes/latest', (req, res, next) => {
    const queryDataSize = req.query.size ? req.query.size : -1; // -1 is default value to fetch all the recipes
    const recipes = repositoryActions.findLatestRecipes(queryDataSize);
    const response = prepareSuccessResonse('recipes',recipes);
    res.status(200).json(response);
});

app.get('/recipes/trending', (req, res, next) => {
    const queryDataSize = req.query.size ? req.query.size : -1; // -1 is default value to fetch all the recipes
    const recipes = repositoryActions.findTrendingRecipes(queryDataSize);
    const response = prepareSuccessResonse('recipes',recipes);
    res.status(200).json(response);
});

app.get('/recipes/:id', (req, res, next) => {
    const recipeId = Number(req.params.id);
    const recipe = repositoryActions.findRecipeById(recipeId);
    if(recipe){
        const response = prepareSuccessResonse('recipe', recipe)
        res.status(200).send(response);
    } else {
        res.status(404).send(`Recipe with Id : ${recipeId} not found.`);
    }
});

app.post('/recipes', (req, res, next) => {
    const recipeData = req.body;
    
    if(recipeData === undefined || recipeData === null)
        res.status(400).send('Recipe data sent is invalid');

    const savedRecipe =repositoryActions.saveRecipe(recipeData);

    return res.status(201).send(savedRecipe);
})

app.put('/recipes/:id', (req, res, next) => {
    const recipeId = Number(req.params.id);
    const recipeBody = req.body;
    const updatedRecipe = repositoryActions.updateRecipe(recipeId, recipeBody);

    if(updatedRecipe === null){
        res.status(404).send('Recipe with the given Id not found.');
    } else {
        res.status(200).send(updatedRecipe);
    }
});

app.delete('/recipes/:id', (req, res, next) => {
    const recipeId = Number(req.params.id);
    const deletedRecipe = repositoryActions.deleteRecipeById(recipeId);

    if(deletedRecipe === null){
        res.status(404).send('Recipe with the given Id not found.');
    } else {
        res.status(200).send(deletedRecipe);
    }
});

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