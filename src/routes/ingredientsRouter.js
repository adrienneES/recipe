import express from 'express';
let ingredientRouter = express.Router();

const router = function (nav) {
  const ingredientController = require('../controllers/ingredientController')(nav);


    ingredientRouter.get('/', ingredientController.getData);

    ingredientRouter.route('/newCategory')
      .post(ingredientController.newCategory);

    ingredientRouter.route('/newIngredient')
      .post(ingredientController.newIngredient);

      ingredientRouter.route('/deleteCategory')
      .post(ingredientController.deleteCategory);

      ingredientRouter.route('/deleteIngredient')
      .get(ingredientController.deleteIngredient);
  return ingredientRouter;
}

module.exports = router;
