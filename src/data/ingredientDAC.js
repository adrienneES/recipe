import mongo from 'mongodb';
const mongodb = mongo.MongoClient;
const url = 'mongodb://localhost:27017/tempDatabase';
const recipeDAC = require('../data/recipeDAC')();

var ingredientDAC =  () =>{
    const getIngredients =  (filter, callback) => {
        mongodb.connect(url, (err, db) => { 
            const collection = db.collection('ingredients');
            if (filter) {
                collection.find({category:{$in:[filter]}}).sort({name:1}).toArray((err, results) => {
                    callback(results);
                });
                } else {
                collection.find({}).sort({name:1}).toArray((err, results) => {
                    callback(results);
                });
                }
        });
    }
    const getIngredientsForRecipe =  (recipe, callback) => {
        mongodb.connect(url, (err, db) => { 
            const collection = db.collection('ingredients');
            collection.find({name: {$in:recipe}}).sort({ingredient:1}).toArray((err, results) => {
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
    const saveIngredient = (ingredient, callback)=> {
        mongodb.connect(url, (err, db) => { 
            const ingredientCollection = db.collection('ingredients');
            ingredientCollection.insert(ingredient,  (err, results) => {
                callback(results);
            });
        });
    }
    const updateIngredient = (ingredient, callback)=> {
        mongodb.connect(url, (err, db) => { 
            const ingredientCollection = db.collection('ingredients');
            ingredientCollection.updateOne({name: ingredient.name}, {$set:{'category':ingredient.category}},  
                  (err, results) => { 
                      callback(results);
                });
        });
    }
    const saveIngredients = (ingredients, callback)=> {
        console.log('ingredientDAC:saveIngredienst');
        mongodb.connect(url, (err, db) => { 
            // dont want to insert dups
            let nameList = [];
            for (let ingredient of ingredients) {
                nameList.push(ingredient.name);
            }
            const ingredientCollection = db.collection('ingredients');
            ingredientCollection.find({name: {$exists:true, $in:nameList}}).
                toArray((err, results) => {
  //                  results.forEach((o)=> {
//                        console.log(o);
    //                })
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
        // don't delete if its part of a recipe - maybe throw an exception
        console.log(ingredient);
        mongodb.connect(url,(err, db) => { 
            recipeDAC.ingredientInUse(ingredient, (results)=> {
                if (results) {
                    console.log('found a results cant delete');
                    callback(null);
                } else {
                    const ingredientCollection = db.collection('ingredients');
                    ingredientCollection.remove({name:ingredient}, (err, results) => {
                        callback(results);
                    });
                }
            })
        });
    }
    return {
        getIngredients : getIngredients, 
        getIngredientsForRecipe : getIngredientsForRecipe,
        deleteIngredients : deleteIngredients,
        saveIngredient : saveIngredient,
        updateIngredient : updateIngredient,
        saveIngredients : saveIngredients,
        getIngredient : getIngredient,
        deleteIngredient : deleteIngredient
    };
}
module.exports = ingredientDAC;
