import express from 'express';
let ingredientRouter = express.Router();

const router = function (nav) {
  const ingredientController = require('../controllers/ingredientController')(nav);


    ingredientRouter.get('/', ingredientController.getData);

    ingredientRouter.route('/saveIngredient')
      .post(ingredientController.saveIngredient);

      ingredientRouter.route('/deleteIngredient')
      .post(ingredientController.deleteIngredient);
      ingredientRouter.route('/editIngredient')
      .get(ingredientController.editIngredient);
  return ingredientRouter;
}

module.exports = router;
