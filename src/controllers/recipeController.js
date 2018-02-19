//codeburst.io/dw6-tutorials-for-beginners-5f3c4e7960be
const utility = require('../utilities/utilities')();
const recipeDAC = require('../data/recipeDAC')();
const ingredientDAC = require('../data/ingredientDAC')();
const typesDAC = require('../data/typesDAC')();

const recipeController =  (nav) => {
  const ingredientController = require('../controllers/ingredientController')(nav);

  const render =  (res, data) => {
    data.view = data.view ? data.view : 'Index';
    res.render(data.view, {
      title: data.title,
      recipes: data.results,
      recipeIngredients:data.recipeIngredients,
      ingredients:data.ingredients,
      units:data.units,
      message:data.message,
      recipe:data.recipe,
      directions:data.directions,
      nav: nav});
  }

  const getRecipes = (req, res) => {
    recipeDAC.getRecipeData( (results) => {
      const data = {view:'recipes',title:'Recipes',results:results, nav:nav};
        render(res, data);
    });
  }
  const saveRecipe =  (req, res) => {
    const currentWeek = (req.body.addedToWeek == 'on') ? 'yes' : 'no';
    const recipeName = req.body.name;
    const recipe = {name : recipeName, timetoCook : req.body.timetoCook, description: req.body.description,
      recipeImage: req.body.recipeImage,  addedToWeek: currentWeek };
    console.log('save a recipe');
    console.log(recipe);
    recipeDAC.getRecipeByName(recipeName, (data) => {
      if (data)  {
        console.log(`updaing ${recipeName}`);
        recipeDAC.updateRecipe({name: recipeName},recipe, (results) => {
          res.redirect('/recipes/recipeDetail/' + recipeName + '?success=inserted%20successfully');
        });
      } else {
        recipeDAC.insertNewRecipe(recipe, (results) => {
          req.query.name = recipeName;
          req.query.success = 'recipe inserted successfully';
          getRecipe(req, res);
        });
      }
    })
  }
  const deleteRecipes =  (req, res) => {
    const recipeName = req.query.name;
    console.log(`deleting recipe: ${recipeName}`)
    recipeDAC.deleteRecipe(recipeName, (results) => {
      req.query.success = 'recipe successfully deleted';
      newRecipe(req, res);
    })
  }
  const newRecipe =  (req, res) => {
    let recipe = {};
    const message = utility.getMessage(req);
      ingredientDAC.getIngredients((results) => {
        const ingredients = results || [];
        // now get units 
        typesDAC.getUnits((units) => {
          units = units || [];
          const data= {view: 'recipeDetail', units: units, directions: [], message:message, title:'recipes', ingredients:results || [], recipeIngredients:[], recipe:recipe, nav:nav}
          render(res, data);
        })
      });

    };
  const getRecipe =  (req, res) => {
    const id = req.params.id || req.query.name;
    const recipeName = id;
    const message = utility.getMessage(req);
    recipeDAC.getRecipeByName(recipeName, (recipe) => {
      if (!recipe) {recipe = {};}
      ingredientDAC.getIngredients((ingredients) => {
        ingredients = ingredients || null;
        // now get units
        typesDAC.getUnits((units) => {
          units = units || [];
          recipeDAC.getRecipeIngredients(recipeName, (results) => {
            const recipeIngredients = results || [];
            recipeDAC.getDirections(recipeName, (directions) => {
              directions = directions || [];
              const data= {view:'recipeDetail', title: 'Recipes', message: message, directions:directions,
                ingredients:ingredients, units: units, recipeIngredients:recipeIngredients, recipe:recipe,
                recipe:recipe, nav:nav}
                render(res, data);
            })
          });
          });
      })
    });
  }
  const addDirection =  (req, res) => {
    const direction = {recipe:req.query.name, direction:req.body.direction, stepNumber: req.body.stepNumber}
    // if this step exists for recipe, do not add
    recipeDAC.getADirection(direction.recipe, direction.stepNumber,  (results) => {
      if (results.length)  {
        res.redirect('/recipes/recipeDetail/'+direction.recipe+'?error=step%20exists%20for%20directions');
      } else {
        recipeDAC.addDirectionToRecipe(direction, (results) => {
          console.log(`added ${req.body.direction} #${req.body.stepNumber} to ${req.query.name}`);
          getRecipe(req, res);
        })
      }
    })
  }
  const deleteDirection =  (req, res) => {
    let queryArray = req.query.name.split('.');
    const direction = {recipeName: queryArray[0], stepNumber:queryArray[1] };
    // if this step exists for recipe, do not add
    recipeDAC.deleteDirectionFromRecipe(req, res, direction, (results) => {
      res.redirect('/recipes/recipeDetail/'+ queryArray[0]+ '?success=deleted');
    })
  }

  const addIngredient = (req, res) => {
    const recipeName = req.query.name;
    const ingredient = {recipe: recipeName, ingredient: req.body.selectedIngredient,
      quantity:req.body.quantity, unit:req.body.unit};
    console.log('adding ingredient');
    console.log(ingredient);
    if (recipeName)  {
      recipeDAC.findIngredientInRecipe(ingredient,  (data) => {
        if (data)  {
          res.redirect('/recipes/recipeDetail/'+ recipeName + '?error=ingredient%20exists%20already');
        }
        else {
          recipeDAC.addIngredientToRecipe(ingredient,  () =>{
            res.redirect('/recipes/recipeDetail/'+ recipeName + '?success=success');
          })
        }
      })
    }
    else {
      res.redirect('/recipes/recipeDetail/?error=no%20recipe%20to%add%20to');
    }
  }
  
  const removeIngredient = (req, res) => {
    const recipeIngredient = {recipe:req.query.name,ingredient:req.body.recipeIngredient};
    console.log(req.body);
    recipeDAC.deleteIngredientFromRecipe(recipeIngredient, (results) => {
      res.redirect('/recipes/recipeDetail/'+ req.query.name + '?success=deleted');
    })
  }
  return {
    getRecipes : getRecipes,
    saveRecipe : saveRecipe,
    recipeDetail: newRecipe,
    getRecipe: getRecipe,
    deleteRecipes:deleteRecipes,
    addIngredient : addIngredient,
    addDirection : addDirection,
    deleteDirection : deleteDirection,
    removeIngredient : removeIngredient
  };
};
module.exports = recipeController;
