import mongo from 'mongodb';
var mongodb = mongo.MongoClient;

var recipeController = function (nav) {
  var url = 'mongodb://localhost:27017/tempDatabase';
  var getRecipes = function(req, res) {
    mongodb.connect(url, function (err, db) {
      var recipeCollection;
      recipeCollection = db.collection('recipes');
      if (recipeCollection) {
        recipeCollection.find({}).toArray(function (err, results) {
          if(err) {
            console.log(`err: ${err}`);
          } else {
            res.render('recipes', {
              title: 'Recipes',
              recipes: results,
              nav: nav});
          }
        });
      }
    });
  }

  var addRecipe = function (req, res) {
    console.log(`adding a recipe ${req.body.name}`);
    var currentWeek = req.body.addedToWeek || 0;
    console.log(`add to week ${currentWeek}`);
    var recipe = {name : req.body.name,
      time : req.body.timetoCook,
      description: req.body.description,
      image: req.body.image
    }
    mongodb.connect(url, function (err, db) {
        var collection = db.collection('recipes');
        if (collection) {
          collection.insert(recipe, function (err, results) {
            // is this week recipe?
            if (currentWeek) {
              var collection = db.collection('week');
              var weekItem = {recipeName: req.body.name};
              collection.insert(weekItem, function(err, results) {
                recipeDetail(req, res);
              })
            } else {
              recipeDetail(req, res);
            }
            });
          }
       });
  }

  var addIngredient = function(req, res) {
    console.log(`adding ingredient ${req.body.selectedIngredient} for recipe: ${req.query.name}`);
    var recipeName = req.query.name;
    var ingredient = {recipe: recipeName, ingredient: req.body.selectedIngredient};
    console.log(ingredient);
    mongodb.connect(url, function(err, db) {
      if (recipeName) {
        var collection = db.collection('recipeIngredients');
        // does this ingredient already exist?
        collection.findOne({
          recipe:recipeName, ingredient:req.body.selectedIngredient
        }, 
        function (err, data) {
          if (data) {
            res.redirect('/recipes/recipeDetail/'+ recipeName + '?error=ingredient%20exists%20already');
          }
          else {
            collection.insert(ingredient, function (err, results) {
              res.redirect('/recipes/recipeDetail/'+ recipeName + '?success=success');
            });
          }
        })
      } else {
  // go back to new recipe screen
        console.log('going back to new recipe');
        getRecipe(req, res);
      }
    });
}
  var recipeDetail = function (req, res) {
    var recipe = {};
      mongodb.connect(url, function(err, db) {
        var ingredientCollection = db.collection('ingredients');
        if (ingredientCollection) {
          ingredientCollection.find({}).toArray( function (err, results) {
            var ingredients = {};
            if (results) {
              ingredients = results;
            }
            var recipeIngredients = {};
            res.render('recipeDetail', {
              title: 'Recipes',
              ingredients:ingredients,
              recipeIngredients: [],
              recipe: recipe,
              nav: nav});
            });
          }
      });
  };
  var getRecipe = function (req, res) {
    var id = req.params.id || req.query.name;
    var message = {};
    console.log(`getRecipe name: ${id}`);
    mongodb.connect(url, function (err, db) {
      var collection = db.collection('recipes');
      if (collection) {
        collection.findOne({name: id},
          function (err, results) {
            if (err) {
              res.send(err);
            } else {
              if (!results) {results = {};}
              var ingredients = {};
              var ingredientCollection = db.collection('ingredients');
              if (ingredientCollection) {
                ingredientCollection.find({}).toArray( function (err, results) {
                  if (results) {
                    ingredients = results;
                  }
                  // now get recipe
                  var recipeCollection = db.collection('recipes');
                  if (recipeCollection) {
                    recipeCollection.findOne({name: id}, function (err, recipe) {
                      // now get the ingredients for this recipe
                      var collection = db.collection('recipeIngredients');
                      collection.find({recipe: id}).toArray( function (err, recipeIngredients ) {
                        console.log('getting ingredients for recipe' + recipeIngredients.length);
                        if (req.query.error) {
                          message = {type:'error', message: req.query.error}
                        } else if (req.query.success) {
                          message = {type:'success', message: 'Ingredient added successfully'}
                        }
                        res.render('recipeDetail', {
                          title: 'Recipes',
                          message: message,
                          recipe: recipe,
                          ingredients: ingredients,
                          recipeIngredients: recipeIngredients,
                          nav: nav
                        });
                       })
                      });
                    }
                  });
                }
              }
            } );
          }
    });

  }
  var deleteRecipes = function (req, res) {
    var recipeName = req.query.name;
    console.log(`deleting recipe: ${recipeName}`)
    mongodb.connect(url, function (err, db) {
      var collection = db.collection('recipes');
      if (recipeName) {
        collection.remove({name: recipeName}, function (err, results) {
          recipeDetail(req, res);
         });
      } else {
        collection.remove( {}, function (err, results) {
          recipeDetail(req, res);
         });
      }
    });
  }
  var showRecipes = function(req, res) {
    mongodb.connect(url, function (err, db) {
      var collection = db.collection('recipes');
      collection.find({}).toArray(function (err, results) {
        res.send(results);
      } );
      });
  }
  return {
    getRecipes : getRecipes,
    addRecipe : addRecipe,
    recipeDetail: recipeDetail,
    getRecipe: getRecipe,
    deleteRecipes:deleteRecipes,
    showRecipes : showRecipes,
    addIngredient : addIngredient
  };
};
module.exports = recipeController;
