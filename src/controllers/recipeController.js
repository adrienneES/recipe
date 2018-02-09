import mongo from 'mongodb';
var mongodb = mongo.MongoClient;

var recipeController = function (nav) {
  var recipeCollection;
  var url = 'mongodb://localhost:27017/tempDatabase';
  var getRecipes = function(req, res) {
    mongodb.connect(url, function (err, db) {
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
      var recipe = {name : req.body.name,
        time : req.body.timetoCook,
        description: req.body.description,
      image: req.body.recipeImage}
      mongodb.connect(url, function (err, db) {
        var collection = db.collection('recipes');
        if (collection) {
          collection.insert(recipe, function (err, results) {
            res.render('newRecipe', {
              title: 'Recipes',
              recipe: recipe,
              nav: nav});
            });
          }

       });
    }

    var addIngredient = function(req, res) {
      res.send('adding ingredient');
    }
    var newRecipe = function (req, res) {
      var recipe = {};
      res.render('newRecipe', {
        title: 'Recipes',
        recipe: recipe,
        nav: nav});
    };
    var getRecipe = function (req, res) {
      var id = req.params.id;
      console.log(id);
      mongodb.connect(url, function (err, db) {
        var collection = db.collection('recipes');
        if (collection) {
          collection.findOne({name: id},
            function (err, results) {
              if (err) {
                res.send(err);
              } else {
                res.render('newRecipe', {
                  title: 'Recipes',
                  recipe: results,
                  nav: nav});
                }
              } );
            }
      });

    }
    var deleteRecipes = function (req, res) {
      var deleteOne = req.query.name;
      mongodb.connect(url, function (err, db) {
        var collection = db.collection('recipes');
        if (deleteOne) {
          collection.remove({name: deleteOne}, function (err, results) {
            var recipe = {};
            res.render('newRecipe', {
              title: 'Recipes',
              recipe: recipe,
              nav: nav});
          });
        } else {
          collection.remove( {}, function (err, results) {
            var recipe = {};
            res.render('newRecipe', {
              title: 'Recipes',
              recipe: recipe,
              nav: nav});
          });
        }
      });

    }
    return {
    getRecipes : getRecipes,
    addRecipe : addRecipe,
    newRecipe: newRecipe,
    getRecipe: getRecipe,
    deleteRecipes:deleteRecipes,
    addIngredient : addIngredient
  };
};
module.exports = recipeController;
