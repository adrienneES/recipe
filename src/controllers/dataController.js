const recipeDAC = require('../data/recipeDAC')();
const shoppingDAC = require('../data/shoppingDAC')();
const ingredientDAC = require('../data/ingredientDAC')();
const typesDAC = require('../data/typesDAC')();

const dataController = function (nav) {
    let data = {recipes: [], recipeIngredients:[],ingredients:[], shoppingList:[], directions: [], 
      categories: [], units: [], collection:'none', nav:nav}
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

  const getData = function(req, res) {
    render(res, data);
  }
  const clearData = function () {
    data = {recipes: [], recipeIngredients:[], ingredients:[], shoppingList:[], directions: [],
      categories: [], units: [], collection:'none', nav:nav};
    return data;
  }
  const showRecipes = function(req, res) {
    recipeDAC.getRecipeData(function (results) {
      let data = clearData();
      data.recipes = results;
      data.collection = 'Recipes';
      render(res, data);
    })
  }
  const deleteRecipes = function (req, res) {
    console.log(`deleting recipes`)
    recipeDAC.deleteAllRecipes(function () { 
      let data = clearData();
      render(res, data);
    });
  }
  const showRecipeIngredients = function (req, res) {
    recipeDAC.getAllRecipeIngredients(function(results) {
      let data = clearData();
      data.collection = 'Recipe Ingredeients';
      data.recipeIngredients = results;
      render(res, data);
    })
  }
  const deleteRecipeIngredients = function(req, res, recipe) {
    recipeDAC.deleteRecipeIngredients(recipe, ()=> {
      let data = clearData();
      render(res, data);
    })
  }
  const showIngredients = function(req, res) {
    ingredientDAC.getIngredients(null, (results) =>{
      let data = clearData();
      data.ingredients = results
      data.collection = 'Ingredients';
      render(res, data);
    });
  }
  const deleteIngredients = function(req, res) {
    ingredientDAC.deleteIngredients(() =>{
      let data = clearData();
      render(res, data);
    });
  }
  const showShoppingList = function (req, res) {
    shoppingDAC.getShoppingList((results) => {
      let data = clearData();
      data.shoppingList = results;
      data.collection = 'ShoppingList';
      render(res, data);
    });
  }
  const deleteShoppingList = function (req, res) {
    shoppingDAC.deleteShoppingList(() => {
      let data = clearData();
      render(res, data);
    })
  }
  const showDirections = function(req, res) {
    recipeDAC.getAllDirections(results => {
      let data = clearData();
      data.directions = results; 
      data.collection = 'directions';
      render(res, data);
    });
  }
  const deleteDirections = function (req, res) {
    recipeDAC.deleteDirections(null, ()=> {
      let data = clearData();
      render(res, data);
    })    
  }
  const showUnits = (req, res) => {
    typesDAC.getUnits(results => {
      let data = clearData();
      data.units = results; 
      data.collection = 'units';
      render(res, data);
    });
  }
  const deleteUnits = function (req, res) {
    typesDAC.deleteUnits( () => {
      let data = clearData();
      render(res, data);
    })    
  }
  const showCategories = (req, res) => {
    typesDAC.getCategories(null, results => {
      let data = clearData();
      data.categories = results; 
      data.collection = 'categories';
      render(res, data);
    });
  }
  const deleteCategories = function (req, res) {
    typesDAC.deleteCategories( ()=> {
      let data = clearData();
      render(res, data);
    })    
  }
  return {
        getData:getData,
        showRecipes:showRecipes,
        showRecipeIngredients:showRecipeIngredients,
        deleteRecipeIngredients:deleteRecipeIngredients,
        deleteRecipes:deleteRecipes,
        showIngredients: showIngredients,
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
