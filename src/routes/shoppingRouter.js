import express from 'express';
let shoppingRouter = express.Router();

const router = function (nav) {
    const shoppingController = require('../controllers/shoppingController')(nav);
    shoppingRouter.get('/', shoppingController.getList);
    shoppingRouter.route('/delete').post(shoppingController.deleteItemFromShoppingList);
    shoppingRouter.route('/filter').post(shoppingController.filterIngredients);
    shoppingRouter.route('/add').post(shoppingController.insertItemInShoppingList);
    shoppingRouter.get('/addToList', shoppingController.addToList);

    return shoppingRouter;
}
module.exports = router;