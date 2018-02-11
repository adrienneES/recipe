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
    console.log('req.body.image');
    var recipe = {name : req.body.name,
      time : req.body.timetoCook,
      description: req.body.description,
      image: req.body.image
    }
    mongodb.connect(url, function (err, db) {
        var collection = db.collection('recipes');
        if (collection) {
          collection.insert(recipe, function (err, results) {
            newRecipe(req, res);
            /*
            var ingredients = [{name:'a'},{name:'aaa'},{name:'aa'}];
            res.render('newRecipe', {
              title: 'Recipes',
              recipe: recipe,
              recipeIngredients: [],
              ingredients: ingredients,
              nav: nav});
              */
            });
          }
       });
  }

  var addIngredient = function(req, res) {
    console.log(`adding ingredient for recipe: ${req.query.name}`);
    var recipeName = req.query.name;
    var ingredient = {recipe: recipeName, ingredient: req.body.selectedIngredient};
    mongodb.connect(url, function(err, db) {
      if (recipeName) {
        // insert recipe
        var collection = db.collection('recipeIngredients');
        collection.insert(ingredient, function (err, results) {
          console.log('inserting ingredient');
          getRecipe(req, res);
        });
        } else {
        // go back to new recipe screen
        console.log('going back to new recipe');
        newRecipe(req, res);
      }
    });
}
  var newRecipe = function (req, res) {
    console.log('new recipe');
    var recipe = {};
      mongodb.connect(url, function(err, db) {
        var ingredientCollection = db.collection('ingredients');
        if (ingredientCollection) {
          ingredientCollection.find({}).toArray( function (err, results) {
            var ingredients = {};
            if (results) {
              ingredients = results;
            }
            res.render('newRecipe', {
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
                      collection.find({recipeName: id}).toArray( function (err, recipeIngredients ) {
                        res.render('newRecipe', {
                          title: 'Recipes',
                          recipe: recipe,
                          ingredients: ingredients,
                          recipeIngredients: recipeIngredients,
                          nav: nav});

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
    console.log(`deleting recipe: ${deleteOne}`)
    mongodb.connect(url, function (err, db) {
      var collection = db.collection('recipes');
      if (recipeName) {
        collection.remove({name: recipeName}, function (err, results) {
          newRecipe(req, res);
         });
      } else {
        collection.remove( {}, function (err, results) {
          newRecipe(req, res);
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
  var showRecipeIngredients = function (req, res) {
    mongodb.connect(url, function (err, db) {
      var collection = db.collection('recipeIngredients');
      collection.find({}).toArray(function (err, results) {
        res.send(results);
      } );
      });
  }
  var deleteRecipeIngredients = function(req, res) {
    mongodb.connect(url, function (err, db) {
      var collection = db.collection('recipeIngredients');
      collection.remove({}, function(err, results) {
        newRecipe(req, res);
      } );
      });
  }
  return {
    getRecipes : getRecipes,
    addRecipe : addRecipe,
    newRecipe: newRecipe,
    getRecipe: getRecipe,
    deleteRecipes:deleteRecipes,
    showRecipes : showRecipes,
    addIngredient : addIngredient,
    showRecipeIngredients:showRecipeIngredients,
    deleteRecipeIngredients:deleteRecipeIngredients
  };
};
module.exports = recipeController;
