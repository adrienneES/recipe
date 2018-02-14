import express from 'express';
let dataRouter = express.Router();

const router = function (nav) {
    const dataController = require('../controllers/dataController')(nav);
    dataRouter.get('/', dataController.getData);
    dataRouter.get('/showRecipes', dataController.showRecipes);
    dataRouter.get('/deleteRecipes', dataController.deleteRecipes);
    dataRouter.get('/showRecipeIngredients', dataController.showRecipeIngredients);
    dataRouter.get('/deleteRecipeIngredients', dataController.deleteRecipeIngredients);
    dataRouter.get('/showIngredients', dataController.showIngredients);
    dataRouter.get('/deleteIngredients', dataController.deleteIngredients);
    dataRouter.get('/showShopping', dataController.showShoppingList);
    dataRouter.get('/deleteShopping', dataController.deleteShoppingList);
    dataRouter.get('/showDirections', dataController.showDirections);
    dataRouter.get('/deleteDirections', dataController.deleteDirections);
    return dataRouter;
}
module.exports = router;