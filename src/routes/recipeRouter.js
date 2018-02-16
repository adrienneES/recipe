import express from 'express';
let recipeRouter = express.Router();

const router = function (nav) {
  const  recipeController = require ('../controllers/recipeController')(nav);
  recipeRouter
    .get('/', recipeController.getRecipes);
  recipeRouter.route('/recipeDetail/:id')
    .get(recipeController.getRecipe);

  recipeRouter
    .get('/recipeDetail', recipeController.recipeDetail);
    recipeRouter
    .get('/deleteRecipes', recipeController.deleteRecipes);
    recipeRouter
    .get('/deleteDirection', recipeController.deleteDirection);
  recipeRouter.route('/saveRecipe')
    .post(recipeController.saveRecipe);
    recipeRouter.route('/addIngredient')
    .post(recipeController.addIngredient);
    recipeRouter.route('/removeIngredient')
    .post(recipeController.removeIngredient);
    recipeRouter.route('/addDirection')
    .post(recipeController.addDirection);

  return recipeRouter;
}
module.exports = router;
