var express = require('express');
var ingredientRouter = express.Router();
var mongodb = require('mongodb').MongoClient;

var router = function (nav) {
  var mdb;
  var url = 'mongodb://localhost:27017/libraryApp';
  var categoryCollection;
  var ingredientCollection;
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

  ingredientRouter.get('/', function (req, res) {
    if (categoryCollection) {
      categoryCollection.find({}).toArray(
        function (err, results) {
          categoryList = results;
          if (ingredientCollection) {
            ingredientCollection.find({}).toArray(
              function(err, results2) {
//                console.log(results2);
                ingredientList = results2;
              });
            }
          }
      );
      }
      res.render('ingredients', {
        title: 'ingredients',
        categories: categoryList,
        ingredients: ingredientList,
        nav: nav});
      });

  ingredientRouter.route('/newCategory')
  .post(function (req, res) {
    var categoryName = {name: req.body.categoryName};
    categoryCollection.insert(categoryName,
      function(err, results) {
        if (err) {
          console.log(err);
        } else {
          res.redirect('/ingredients');
              }
          });
    });
    ingredientRouter.route('/newIngredient')
    .post(function (req, res) {
      var category = {category : req.body.ingredientCategory, name: req.body.ingredientName};
      ingredientCollection.insert(category,
      function (err, results) {
        if (err) {
          console.log(err);
        } else {
          res.send(results);
        }
      })
      });
    ingredientRouter.route('/deleteCategory')
  .post(function (req, res) {
    var category = req.body.categoryName;
    categoryCollection.remove({name: category},
      function(err, results) {
        if (err) {
          console.log(err);
        } else {
          res.redirect('/ingredients');
        }
       })
    });
  });
  return ingredientRouter;
}

module.exports = router;
