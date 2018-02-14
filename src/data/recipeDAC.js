import mongo from 'mongodb';
const mongodb = mongo.MongoClient;
const url = 'mongodb://localhost:27017/tempDatabase';

var recipeDAC = function() {

    const addDirectionToRecipe = function (direction, callback) {
        mongodb.connect(url, function(err, db) {
          const ingredientCollection = db.collection('directions');
          ingredientCollection.insert({
            recipe:direction.recipe, direction:direction.direction, stepNumber:direction.stepNumber}, function (err, data) { 
              callback(data);
            }
          );
        });
      }
      const getADirection = function (recipeName, stepNumber, callback) {
        mongodb.connect(url, function(err, db) { 
          console.log(`looking for ${stepNumber} : ${recipeName}`);
          const ingredientCollection = db.collection('directions');
          let query = { recipe: recipeName, stepNumber:stepNumber  };
          ingredientCollection.find(query).toArray(function(err, results){
            console.log(results);
            callback(results);
          });
        });
      }
      const getDirections = function (recipeName, callback) {
        mongodb.connect(url, function(err, db) { 
          const ingredientCollection = db.collection('directions');
          ingredientCollection.find({recipe:recipeName}).toArray(function(err, results){
            callback(results);
          });
        });
      }
      const getAllDirections = function (callback) {
        mongodb.connect(url, function(err, db) { 
          const ingredientCollection = db.collection('directions');
          ingredientCollection.find().toArray(function(err, results){
            callback(results);
          });
        });
      }

      const deleteDirections = function (callback) {
        mongodb.connect(url, function(err, db) { 
          const directionCollection = db.collection('directions');
          directionCollection.remove({}, function (err, results) { 
              callback(results);
          } );
        });
      }
    
      const deleteDirectionFromRecipe = function (req, res,direction, callback) {
        mongodb.connect(url, function(err, db) { 
          const directionCollection = db.collection('directions');
          let query = { recipe: direction.recipeName, stepNumber:direction.stepNumber  };
          directionCollection.remove(query, (err, results)=>{
            getRecipe(req, res)
          })
        });
      }
      const getRecipeData = function (callback) {
        mongodb.connect(url, function (err, db) {
          const recipeCollection = db.collection('recipes');
          recipeCollection.find({}).toArray(function (err, results) {
            callback(results);
          });
        });
      }
      const getRecipeByName = function (item, callback) {
        mongodb.connect(url, function (err, db) { 
          const collection = db.collection('recipes');
          if (collection) {
            collection.findOne({recipe:item}, function (err, recipe) { 
              callback(recipe);
            });
          }
        });
      }
      const insertNewRecipe = function (recipe, callback) {
        mongodb.connect(url, function (err, db) {
          const collection = db.collection('recipes');
          collection.insert(recipe, function (err, results) {
            callback(results);
           });
         });
      }
      const deleteRecipe = function (recipeName, callback) {
        mongodb.connect(url, function (err, db) { 
          const collection = db.collection('recipes');
          collection.remove(recipeName? {name:recipeName} : {}, function (err, results) { 
            callback(results);
          });
        });  
      }
      const deleteAllRecipes = function (callback) {
        mongodb.connect(url, function (err, db) { 
          const collection = db.collection('recipes');
          collection.remove({}, function (err, results) { 
            callback(results);
          });
        });  
      }


  
  // recipeIngredient
  const getAllRecipeIngredients = function(callback) {
    mongodb.connect(url, function(err, db) { 
      const ingredientCollection = db.collection('recipeIngredients');
      ingredientCollection.find({}).toArray(function(err, results){
        callback(results);
      });
    });
  }
  const getRecipeIngredients = function(recipeName, callback) {
    mongodb.connect(url, function(err, db) { 
      const ingredientCollection = db.collection('recipeIngredients');
      ingredientCollection.find({recipe:recipeName}).toArray(function(err, results){
        callback(results);
      });
    });
  }
  const findIngredientInRecipe = function(ingredient, callback) {
    mongodb.connect(url, function(err, db) {
      const ingredientCollection = db.collection('recipeIngredients');
      ingredientCollection.findOne({
        recipe:ingredient.recipe, ingredient:ingredient.ingredient}, function (err, data) { 
        callback(data);
      }
    );
   });
  }
  const addIngredientToRecipe = function(ingredient, callback) {
    mongodb.connect(url, function(err, db) {
      const ingredientCollection = db.collection('recipeIngredients');
      ingredientCollection.insert({
        recipe:ingredient.recipe, ingredient:ingredient.ingredient}, function (err, data) { 
          callback(data);
        }
      );
    });
  }
  const getRecipesForWeek = (callback) =>
  {
    mongodb.connect(url, function (err, db) { 
      const collection = db.collection('recipes');
      collection.find({addedToWeek : 1}).toArray(function(err, data){
        callback(data);
       });
    });

  }
    return {
        addDirectionToRecipe : addDirectionToRecipe,
        getADirection : getADirection,
        getDirections : getDirections,
        getAllDirections : getAllDirections,
        deleteDirectionFromRecipe : deleteDirectionFromRecipe, 
        deleteDirections : deleteDirections, 
        getRecipeData : getRecipeData,
        getRecipeByName : getRecipeByName,
        insertNewRecipe : insertNewRecipe,
        deleteRecipe : deleteRecipe,
        deleteAllRecipes : deleteAllRecipes,
        getAllRecipeIngredients : getAllRecipeIngredients,
        getRecipeIngredients : getRecipeIngredients,
        findIngredientInRecipe : findIngredientInRecipe,
        addIngredientToRecipe : addIngredientToRecipe,
        getRecipesForWeek : getRecipesForWeek
    };
}
module.exports = recipeDAC;