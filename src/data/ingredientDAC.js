import mongo from 'mongodb';
const mongodb = mongo.MongoClient;
const url = 'mongodb://localhost:27017/tempDatabase';
const typesDAC = require('../data/typesDAC')();

var ingredientDAC =  () =>{
    const getIngredients =  (callback) => {
        mongodb.connect(url, (err, db) => { 
            const collection = db.collection('ingredients');
            collection.find({}).toArray((err, results) => {
                callback(results);
            });
        });
    }
    const getIngredientsForRecipe =  (ingredients, callback) => {
        mongodb.connect(url, (err, db) => { 
            const collection = db.collection('ingredients');
            collection.find({name: {$in:ingredients}}).toArray((err, results) => {
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
            // dont want to insert dups
            let nameList = [];
            for (let ingredient of ingredients) {
                nameList.push(ingredient.name);
            }
            const ingredientCollection = db.collection('ingredients');
            ingredientCollection.find({name: {$exists:true, $in:nameList}}).
                toArray((err, results) => {
                    for (let item of results) {
                        let index = nameList.indexOf(item.name);
                        if (index > -1) {
                            nameList.splice(index, 1);
                        }
                    }
                    let insertList = [];
                    for (let item of ingredients) {
                        if (nameList.indexOf(item.name) > -1) {
                            insertList.push({category : item.category, 
                                name: item.name});
                        }
                    }
                    if (insertList.length > 0) {
                        ingredientCollection.insertMany(insertList,  (err, results) => {
                            callback(results);
                        });
                    } else {
                        callback(null);
                    }
                })
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
        getIngredientsForRecipe : getIngredientsForRecipe,
        deleteIngredients : deleteIngredients,
        newIngredient : newIngredient,
        newIngredients : newIngredients,
        getIngredient : getIngredient,
        deleteIngredient : deleteIngredient,
        deleteRecipeIngredients : deleteRecipeIngredients
    };
}
module.exports = ingredientDAC;
