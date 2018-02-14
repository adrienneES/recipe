import mongo from 'mongodb';
const mongodb = mongo.MongoClient;
const url = 'mongodb://localhost:27017/tempDatabase';

var ingredientDAC =  function() {
    const getIngredients = function (callback) {
        mongodb.connect(url, function(err, db) { 
            const collection = db.collection('ingredients');
            collection.find({}).toArray(function(err, results) {
              callback(results);
            });
        });
    }
    const getIngredient = function (ingredientName, callback) {
      mongodb.connect(url, function(err, db) { 
          const collection = db.collection('ingredients');
          collection.findOne({name:ingredientName },function(err, results) {
            callback(results);
          });
        });
    }
    const deleteIngredients = function (callback) {
        mongodb.connect(url, function(err, db) { 
          const collection = db.collection('ingredients');
          collection.remove({name: category}, function (err, data) {
            callback(data);
          } );
        });
    }
    const getCategories = function( callback) {
        mongodb.connect(url,function(err, db) { 
            const categoryCollection = db.collection('categories');
            categoryCollection.find({}).toArray( function (err, data) {
              callback(data);
            });
        });
    }
    const createCategory = function(categoryName, callback) {
        mongodb.connect(url,function(err, db) { 
            const categoryCollection = db.collection('categories');
            categoryCollection.insert(categoryName, function (err, data) {
              callback(data);
            });
        });
    }
    const newIngredient = (ingredient, callback)=> {
        mongodb.connect(url, function(err, db) { 
            const ingredientCollection = db.collection('ingredients');
            ingredientCollection.insert(ingredient, function (err, results) {
                callback(results);
            });
            });
        
    }
    const deleteCategory = (category, callback) => {
        mongodb.connect(url,function(err, db) { 
            const categoryCollection = db.collection('categories');
            categoryCollection.remove({name: category}, (results) => {
                callback(results);
              }
            );
        });
    }
    const deleteIngredient = (ingredient, callback) => {
        mongodb.connect(url,function(err, db) { 
            const ingredientCollection = db.collection('ingredients');
            ingredientCollection.remove({name:ingredient}, (err, results) => {
                callback(results);
            });
        });
    }
    const deleteRecipeIngredients = (callback)=>{
        mongodb.connect(url, function (err, db) {
          const collection = db.collection('recipeIngredients');
          collection.remove({}, function(err, results) {
              callback(results);
          } );
          });
      }
                
    return {
        getIngredients : getIngredients, 
        deleteIngredients : deleteIngredients,
        createCategory : createCategory,
        newIngredient : newIngredient,
        getIngredient : getIngredient,
        deleteCategory : deleteCategory,
        deleteIngredient : deleteIngredient,
        getCategories : getCategories,
        deleteRecipeIngredients : deleteRecipeIngredients
    };
}
module.exports = ingredientDAC;
