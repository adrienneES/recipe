var mongodb = require('mongodb').MongoClient;
var ingredientController = function (nav) {
  var sayHi = function() {
    console.log('hi');
  };
  var categoryCollection;
  var ingredientCollection;
  var ingredientList = {};
  var categoryList = {};
  var url = 'mongodb://localhost:27017/tempDatabase';
  var getData = function (req, res) {
    mongodb.connect(url,
      function(err, db) {
        categoryCollection = db.collection('categories');
        ingredientCollection = db.collection('ingredients');
        if (categoryCollection) {
          categoryCollection.find({}).toArray(
            function (err, results) {
              categoryList = results;
              if (ingredientCollection) {
                ingredientCollection.find({}).toArray(
                  function (err, results) {
                    ingredientList = results;
                    res.render('ingredients', {
                      title: 'ingredients',
                      categories: categoryList,
                      ingredients: ingredientList,
                      nav: nav});
                  }
                )
              }
            }
          )
        }
      });
    }
    var newCategory = function (req, res) {
      console.log(`cateogry ${req.body.categoryName}`);
      var categoryName = {name: req.body.categoryName};
      categoryCollection.insert(categoryName,
        function(err, results) {
          if (err) {
            console.log(err);
          } else {
            res.redirect('/ingredients');
                }
        });
    }
    var newIngredient = function (req, res) {
      var category = {category : req.body.ingredientCategory, name: req.body.ingredientName};
      ingredientCollection.insert(category,
        function (err, results) {
          if (err) {
            console.log(err);
          } else {
            res.redirect('/ingredients');
          }
        })
    };
    var deleteCategory = function (req, res) {
      var category = req.body.categoryName;
      console.log('category:' + category);
      categoryCollection.remove({name: category},
        function(err, results) {
          if (err) {
            console.log(err);
          } else {
            res.redirect('/ingredients');
          }
         })
      }

    var deleteIngredient = function (req, res) {
      var ingredientName = req.body.ingredientName;
      console.log('ingredientName:' + ingredientName);
      res.send('deleted');
/*       categoryCollection.remove({name: category},
        function(err, results) {
          if (err) {
            console.log(err);
          } else {
            res.redirect('/ingredients');
          }
         })
 */      }

    return {
      deleteCategory : deleteCategory,
      newIngredient : newIngredient,
      getData:getData,
      deleteIngredient:deleteIngredient,
      newCategory: newCategory
    };
  };
module.exports = ingredientController;
