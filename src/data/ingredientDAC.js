import mongo from 'mongodb';
const mongodb = mongo.MongoClient;
const url = 'mongodb://localhost:27017/tempDatabase';
const typesDAC = require('../data/typesDAC')();

var ingredientDAC =  () =>{
    const getIngredients =  (callback) => {
        mongodb.connect(url, (err, db) => { 
            const collection = db.collection('ingredients');
                typesDAC.getCategories(() => {
                    collection.find({}).toArray((err, results) => {
                        callback(results);
                    });
                });
            });
        }
    const getIngredient =  (ingredientName, callback) => {
      mongodb.connect(url, (err, db) => { 
          const collection = db.collection('ingredients');
          collection.findOne({name:ingredientName },(err, results) => {
            callback(results);
          });
        });
    }
    const deleteIngredients =  (callback) => {
        mongodb.connect(url, (err, db) => { 
          const collection = db.collection('ingredients');
          collection.remove({},  (err, data) => {
            callback(data);
          } );
        });
    }
    const newIngredient = (ingredient, callback)=> {
        mongodb.connect(url, (err, db) => { 
            const ingredientCollection = db.collection('ingredients');
            ingredientCollection.insert(ingredient,  (err, results) => {
                callback(results);
            });
        });
    }
    const newIngredients = (ingredients, callback)=> {
        mongodb.connect(url, (err, db) => { 
            const ingredientCollection = db.collection('ingredients');
            ingredientCollection.insertMany(ingredients,  (err, results) => {
                callback(results);
            });
        });
    }
    const deleteIngredient = (ingredient, callback) => {
        mongodb.connect(url,(err, db) => { 
            const ingredientCollection = db.collection('ingredients');
            ingredientCollection.remove({name:ingredient}, (err, results) => {
                callback(results);
            });
        });
    }
    const deleteRecipeIngredients = (callback) => {
        mongodb.connect(url,  (err, db) => {
          const collection = db.collection('recipeIngredients');
          collection.remove({}, (err, results) => {
              callback(results);
          } );
        });
    }
              
    return {
        getIngredients : getIngredients, 
        deleteIngredients : deleteIngredients,
        newIngredient : newIngredient,
        newIngredients : newIngredients,
        getIngredient : getIngredient,
        deleteIngredient : deleteIngredient,
        deleteRecipeIngredients : deleteRecipeIngredients
    };
}
module.exports = ingredientDAC;
