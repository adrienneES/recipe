import mongo from 'mongodb';
const mongodb = mongo.MongoClient;
const url = 'mongodb://localhost:27017/tempDatabase';

var recipeDAC = () => {

    const addDirectionToRecipe =  (direction, callback) => {
        mongodb.connect(url, (err, db) => {
          const ingredientCollection = db.collection('directions');
          ingredientCollection.insert({
            recipe:direction.recipe, 
            direction:direction.direction, 
            stepNumber:direction.stepNumber},  (err, data) => { 
              callback(data);
            }
          );
        });
    }
    const getADirection =  (recipeName, stepNumber, callback) => {
      mongodb.connect(url, (err, db) => { 
        console.log(`looking for ${stepNumber} : ${recipeName}`);
        const ingredientCollection = db.collection('directions');
        let query = { recipe: recipeName, stepNumber:stepNumber  };
        ingredientCollection.find(query).toArray((err, results) =>{
          console.log(results);
          callback(results);
        });
      });
    }
    const getDirections =  (recipeName, callback) => {
      mongodb.connect(url, (err, db) => { 
        const ingredientCollection = db.collection('directions');
        ingredientCollection.find({recipe:recipeName}).toArray((err, results) => {
          callback(results);
        });
      });
    }
    const getAllDirections =  (callback) => {
      mongodb.connect(url, (err, db) => { 
        const ingredientCollection = db.collection('directions');
        ingredientCollection.find().toArray((err, results) => {
          callback(results);
        });
      });
    }

    const deleteDirections =  (callback) => {
      mongodb.connect(url, (err, db) => { 
        const directionCollection = db.collection('directions');
        directionCollection.remove({},  (err, results) => { 
            callback(results);
        } );
      });
    }
  
    const deleteDirectionFromRecipe =  (req, res,direction, callback) => {
      mongodb.connect(url, (err, db) => { 
        const directionCollection = db.collection('directions');
        let query = { recipe: direction.recipeName, stepNumber:direction.stepNumber  };
        directionCollection.remove(query, (err, results)=>{
          callback(results);
        })
      });
    }
    const getRecipeData =  (callback) => {
      mongodb.connect(url,  (err, db) => {
        const recipeCollection = db.collection('recipes');
        recipeCollection.find({}).toArray( (err, results) => {
          callback(results);
        });
      });
    }
    const getRecipeByName =  (item, callback) => {
      mongodb.connect(url,  (err, db) => { 
        const collection = db.collection('recipes');
        if (collection) {
          collection.findOne({name:item},  (err, recipe) => { 
            callback(recipe);
          });
        }
      });
    }
    const insertNewRecipe =  (recipe, callback) => {
      mongodb.connect(url,  (err, db) => {
        const collection = db.collection('recipes');
        collection.insert(recipe,  (err, results) => {
          callback(results);
          });
        });
    }
    const updateRecipe =  (recipe, data, callback) => {
      mongodb.connect(url,  (err, db) => {
        const collection = db.collection('recipes');
        collection.updateOne(recipe, { 
          $set: { "description" : data.description, "timetoCook": data.timetoCook, 
            "recipeImage" : data.recipeImage, "addedToWeek" : data.addedToWeek } },  
            (err, results) => { callback(results);
          });
        });
    }
    const deleteRecipe =  (recipeName, callback) => {
      mongodb.connect(url,  (err, db) => { 
        const collection = db.collection('recipes');
        collection.remove(recipeName? {name:recipeName} : {},  (err, results) => { 
          callback(results);
        });
      });  
    }
    const deleteAllRecipes =  (callback) => {
      mongodb.connect(url,  (err, db) => { 
        const collection = db.collection('recipes');
        collection.remove({},  (err, results) => { 
          callback(results);
        });
      });  
    }
    const getAllRecipeIngredients = (callback) => {
      mongodb.connect(url, (err, db) => { 
        const ingredientCollection = db.collection('recipeIngredients');
        ingredientCollection.find({}).toArray((err, results) => {
          callback(results);
        });
      });
    }
    const getRecipeIngredients = (recipeName, callback) => {
      mongodb.connect(url, (err, db) => { 
        const ingredientCollection = db.collection('recipeIngredients');
        ingredientCollection.find({recipe:recipeName}).toArray((err, results) => {
          callback(results);
        });
      });
    }
    const findIngredientInRecipe = (ingredient, callback) => {
      mongodb.connect(url, (err, db) => {
        const ingredientCollection = db.collection('recipeIngredients');
        ingredientCollection.findOne({
          recipe:ingredient.recipe, ingredient:ingredient.ingredient},  (err, data) => { 
          callback(data);
        }
      );
      });
    }
    const addIngredientToRecipe = (ingredient, callback) => {
      mongodb.connect(url, (err, db) => {
        const ingredientCollection = db.collection('recipeIngredients');
        ingredientCollection.insert(ingredient,  (err, data) => { 
            callback(data);
          }
        );
      });
    }
    const addIngredientsToRecipes = (ingredient, callback) => {
      mongodb.connect(url, (err, db) => {
        const ingredientCollection = db.collection('recipeIngredients');
        ingredientCollection.insertMany(ingredient,  (err, data) => { 
            callback(data);
          }
        );
      });
    }
    const deleteIngredientFromRecipe =  (ingredient, callback) => {
      mongodb.connect(url, (err, db) => { 
        const ingredientCollection = db.collection('recipeIngredients');
        ingredientCollection.remove(ingredient,(err, results)=>{
          callback(results);
        })
      });
    }

  const getRecipesForWeek = (callback) =>
    {
      mongodb.connect(url,  (err, db) => { 
        const collection = db.collection('recipes');
        collection.find({addedToWeek : 'yes'}).toArray((err, data) => {
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
      updateRecipe : updateRecipe,
      deleteRecipe : deleteRecipe,
      deleteAllRecipes : deleteAllRecipes,
      getAllRecipeIngredients : getAllRecipeIngredients,
      getRecipeIngredients : getRecipeIngredients,
      findIngredientInRecipe : findIngredientInRecipe,
      addIngredientToRecipe : addIngredientToRecipe,
      addIngredientsToRecipes : addIngredientsToRecipes,
      deleteIngredientFromRecipe : deleteIngredientFromRecipe,
      getRecipesForWeek : getRecipesForWeek
    };
}
module.exports = recipeDAC;