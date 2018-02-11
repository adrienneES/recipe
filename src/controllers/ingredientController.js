var mongodb = require('mongodb').MongoClient;
var ingredientController = function (nav) {
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
                    var message = {};
                    ingredientList = results;
                    if (req.query.error) {
                      message = {type:'error', message: req.query.error}
                    } else if (req.query.success) {
                      message = {type:'success', message: 'Ingredient added successfully'}
                    }
                    res.render('ingredients', {
                      title: 'ingredients',
                      message: message,
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
      var staple = req.body.staple ? 'yes' : 'no';
      var category = {
        category : req.body.ingredientCategory, 
        name: req.body.ingredientName,
        staple: staple
      };
      ingredientCollection.findOne({name:req.body.ingredientName}, function (err, results) {
        if (results) {
          res.redirect('/ingredients?error=ingredient%20exists%20already');
        }else {
          ingredientCollection.insert(category,
            function (err, results) {
              if (err) {
                console.log(err);
              } else {
                res.redirect('/ingredients?success=added');
              }
            })
            }
      });
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
      var ingredientName = req.body.ingredientName || req.query.ingredientName;
      console.log('ingredientName:' + ingredientName);
      ingredientCollection.remove({name:ingredientName}, function(err, results) {
        if (err) {
          console.log(err);
        } else {
          res.redirect('/ingredients');
        }
      });
    }

    return {
      deleteCategory : deleteCategory,
      newIngredient : newIngredient,
      getData:getData,
      deleteIngredient:deleteIngredient,
      newCategory: newCategory
    };
  };
module.exports = ingredientController;
