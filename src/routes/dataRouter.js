import express from 'express';
var dataRouter = express.Router();

var router = function (nav) {
    var dataController = require('../controllers/dataController')(nav);
    dataRouter.get('/', dataController.getData);
    dataRouter.get('/showRecipes', dataController.showRecipes);
    dataRouter.get('/deleteRecipes', dataController.deleteRecipes);
    dataRouter.get('/showRecipeIngredients', dataController.showRecipeIngredients);
    dataRouter.get('/deleteRecipeIngredients', dataController.deleteRecipeIngredients);
    dataRouter.get('/showIngredients', dataController.showIngredients);
    dataRouter.get('/deleteIngredients', dataController.deleteIngredients);
    dataRouter.get('/showWeek', dataController.showWeek);
    dataRouter.get('/deleteWeek', dataController.deleteWeek);
    return dataRouter;
}
module.exports = router;