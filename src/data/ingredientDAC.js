import mongo from 'mongodb';
const mongodb = mongo.MongoClient;
const url = 'mongodb://localhost:27017/tempDatabase';

var ingredientDAC =  () =>{
    const getIngredients =  (callback) => {
        mongodb.connect(url, (err, db) => { 
            const collection = db.collection('ingredients');
            collection.find({}).toArray((err, results) => {
              callback(results);
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
          collection.remove({name: category},  (err, data) => {
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
        getIngredient : getIngredient,
        deleteIngredient : deleteIngredient,
        deleteRecipeIngredients : deleteRecipeIngredients
    };
}
module.exports = ingredientDAC;
