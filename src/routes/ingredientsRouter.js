var express = require('express');
var ingredientRouter = express.Router();
var mongodb = require('mongodb').MongoClient;

var router = function (nav) {
  var mdb;
  var url = 'mongodb://localhost:27017/tempDatabase';
  var categoryCollection;
  var ingredientCollection;
  var ingredientController = require('../controllers/ingredientController')(nav);
  mongodb.connect(url, function(err, db) {
    if (!db) {
      console.log('no db');
    }
    else {
      categoryCollection = db.collection('categories');
      ingredientCollection = db.collection('ingredients');
    }
    var ingredientList = {};
    var categoryList = {};

    ingredientRouter.get('/', ingredientController.getData);

    ingredientRouter.route('/newCategory')
      .post(ingredientController.newCategory);

    ingredientRouter.route('/newIngredient')
      .post(ingredientController.newIngredient);

      ingredientRouter.route('/deleteCategory')
      .post(ingredientController.deleteCategory);

      ingredientRouter.route('/deleteIngredient')
      .post(ingredientController.deleteIngredient);
  });
  return ingredientRouter;
}

module.exports = router;
