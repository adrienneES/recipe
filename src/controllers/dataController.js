const recipeDAC = require('../data/recipeDAC')();
const shoppingDAC = require('../data/shoppingDAC')();
const ingredientDAC = require('../data/ingredientDAC')();
const typesDAC = require('../data/typesDAC')();

const render = function (res, data) {
  res.render('data', {
    title: 'data',
    recipes: data.recipes,
    recipesIngredients: data.recipeIngredients,
    ingredients: data.ingredients,
    shoppingList: data.shoppingList,
    categories: data.categories,
    collection: data.collection,
    directions : data.directions,
    units: data.units,
    nav: data.nav});

}
const dataController = function (nav) {
  const ingredientController = require('../controllers/ingredientController')(nav);
  const recipeController = require('../controllers/recipeController')(nav);
  let data = {recipes: [], recipeIngredients:[],ingredients:[], shoppingList:[], directions: [], 
    categories: [], units: [], collection:'none', nav:nav}
  const getData = function(req, res) {
    render(res, data);
  }
  const clearData = function () {
    data = {recipes: [], recipeIngredients:[], ingredients:[], shoppingList:[], directions: [],
      categories: [], units: [], collection:'none', nav:nav}  
  }
  const showRecipes = function(req, res) {
    recipeDAC.getRecipeData(function (results) {
      clearData();
      data.recipes = results;
      data.collection = 'Recipes';
      render(res, data);
    })
  }
  const deleteRecipes = function (req, res) {
    console.log(`deleting recipes`)
    recipeDAC.deleteAllRecipes(function (results) { 
      getData(req, res);
    });
  }
  const showRecipeIngredients = function (req, res) {
    recipeDAC.getAllRecipeIngredients(function(results) {
      clearData();
      data.collection = 'Recipe Ingredeients';
      data.recipeIngredients = results;
//      const data = {recipes: [], recipeIngredients:results,ingredients:[], shoppingList:[], collection:'Recipe Ingredeients', nav:nav}
      render(res, data);
    })
  }
  const deleteRecipeIngredients = function(req, res) {
    ingredientDAC.deleteRecipeIngredients((results)=> {
      getData(req, res);
    })
  }
  const showIngredients = function(req, res) {
    ingredientDAC.getIngredients((results) =>{
      clearData();
      data.ingredients = results
      data.collection = 'Ingredients';
      render(res, data);
    });
  }
  const deleteIngredients = function(req, res) {
    ingredientDAC.deleteIngredients((results) =>{
      getData(req, res);
    });
  }
  const showShoppingList = function (req, res) {
    shoppingDAC.getShoppingList((results) => {
      clearData();
      data.shoppingList = results;
      data.collection = 'ShoppingList';
      render(res, data);
  });
  }
  const deleteShoppingList = function (req, res) {
    shoppingDAC.deleteShoppingList((results) => {
      getData(req, res);
    })
  }
  const showDirections = function(req, res) {
    recipeDAC.getAllDirections(results => {
      clearData();
      data.directions = results; 
      data.collection = 'directions';
      render(res, data);
    });
  }
  const deleteDirections = function (req, res) {
    recipeDAC.deleteDirections(results=> {
      getData(req, res);
    })    
  }
  const showUnits = (req, res) => {
    typesDAC.getUnits(results => {
      clearData();
      data.units = results; 
      data.collection = 'units';
      render(res, data);
    });
  }
  const deleteUnits = function (req, res) {
    typesDAC.deleteDirections(results=> {
      getData(req, res);
    })    
  }
  const showCategories = (req, res) => {
    typesDAC.getCategories(results => {
      clearData();
      data.categories = results; 
      data.collection = 'categories';
      render(res, data);
    });
  }
  const deleteCategories = function (req, res) {
    typesDAC.deleteCategories(results=> {
      getData(req, res);
    })    
  }
  return {
        getData:getData,
        showRecipes:showRecipes,
        showRecipeIngredients:showRecipeIngredients,
        deleteRecipeIngredients:deleteRecipeIngredients,
        deleteRecipes:deleteRecipes,
        showIngredients: showIngredients,
        deleteRecipes:deleteRecipes,
        deleteIngredients:deleteIngredients,
        showShoppingList: showShoppingList,
        deleteShoppingList:deleteShoppingList,
        showDirections: showDirections,
        deleteDirections:deleteDirections,
        showUnits : showUnits, 
        deleteUnits : deleteUnits,
        showCategories : showCategories,
        deleteCategories : deleteCategories
    }
  };

module.exports = dataController;
