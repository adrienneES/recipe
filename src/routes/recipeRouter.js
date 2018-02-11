import express from 'express';
var recipeRouter = express.Router();
var mongodb = require('mongodb').MongoClient;
var objectId = require('mongodb').ObjectID;

var router = function (nav) {
  var  recipeController = require ('../controllers/recipeController')(nav);
  recipeRouter
    .get('/', recipeController.getRecipes);
  recipeRouter.route('/recipeDetail/:id')
    .get(recipeController.getRecipe);

  recipeRouter
    .get('/recipeDetail', recipeController.recipeDetail);
    recipeRouter
    .get('/deleteRecipes', recipeController.deleteRecipes);
  recipeRouter.route('/addRecipe')
    .post(recipeController.addRecipe);
  recipeRouter.route('/addIngredient')
    .post(recipeController.addIngredient);

  return recipeRouter;
}
module.exports = router;
