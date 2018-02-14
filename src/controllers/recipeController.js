//codeburst.io/dw6-tutorials-for-beginners-5f3c4e7960be
const utility = require('../utilities/utilities')();
const recipeDAC = require('../data/recipeDAC')();
const ingredientDAC = require('../data/ingredientDAC')();

const recipeController = function (nav) {
  const ingredientController = require('../controllers/ingredientController')(nav);

  const render = function (res, data) {
    data.view = data.view ? data.view : 'Index';
    res.render(data.view, {
      title: data.title,
      recipes: data.results,
      recipeIngredients:data.recipeIngredients,
      ingredients:data.ingredients,
      message:data.message,
      recipe:data.recipe,
      directions:data.directions,
      nav: data.nav});
  }


  const getRecipes = function(req, res) {
    recipeDAC.getRecipeData(function (results) {
      const data = {view:'recipes',title:'Recipes',results:results, nav:nav};
        render(res, data);
    });
  }
  const addRecipe = function (req, res) {
    const currentWeek = (req.body.addedToWeek == 'on') ? 1 : 0;
    const recipeName = req.body.name;
    const recipe = {name : recipeName, time : req.body.timetoCook, description: req.body.description,
      image: req.body.image,  addedToWeek: currentWeek };
    console.log('adding a recipe');
    console.log(recipe);
    recipeDAC.getRecipeByName(recipeName, function(data) {
      if (data) {
        res.redirect('/recipes/recipeDetail/?error=recipe%20exists%20already');
      } else {
        recipeDAC.insertNewRecipe(recipe, function(results) {
          res.redirect('/recipes/recipeDetail/' + recipeName + '?success=inserted%20successfully');
        });
      }
    })
  }
  const deleteRecipes = function (req, res) {
    const recipeName = req.query.name;
    console.log(`deleting recipe: ${recipeName}`)
    recipeDAC.deleteRecipe(recipeName, function(results) {
      req.query.success = 'recipe successfully deleted';
      recipeDetail(req, res);
    })
  }
  const addIngredient = function(req, res) {
    const recipeName = req.query.name;
    const ingredient = {recipe: recipeName, ingredient: req.body.selectedIngredient};
    console.log('adding ingredient');
    console.log(ingredient);
    if (recipeName) {
      recipeDAC.findIngredientInRecipe(ingredient, function (data) {
        if (data) {
          res.redirect('/recipes/recipeDetail/'+ recipeName + '?error=ingredient%20exists%20already');
        }
        else {
          recipeDAC.addIngredientToRecipe(ingredient, function (){
            res.redirect('/recipes/recipeDetail/'+ recipeName + '?success=success');
          })
        }
      })
    }
    else {
      res.redirect('/recipes/recipeDetail/?error=no%20recipe%20to%add%20to');
    }
  }
  const recipeDetail = function (req, res) {
    let recipe = {};
    const message = utility.getMessage(req);
      ingredientDAC.getIngredients(function(results) {
        const ingredients = results || [];
        const data= {view: 'recipeDetail', directions: [], message:message, title:'recipes', 
            ingredients:results || [], recipeIngredients:[], recipe:recipe, nav:nav}
        render(res, data);
      });

    };
  const getRecipe = function (req, res) {
    const id = req.params.id || req.query.name;
    const recipeName = id;
    const message = utility.getMessage(req);
    console.log(`getRecipe name: ${id}`);
    recipeDAC.getRecipeByName(recipeName, function(recipe) {
      if (!recipe) {recipe = {};}
      ingredientDAC.getIngredients(function(results) {
        let ingredients = [];
        if (results) {
          ingredients = results;
        }
        recipeDAC.getRecipeIngredients(recipeName, function(results) {
          const recipeIngredients = results || [];
          recipeDAC.getDirections(recipeName, function(results) {
            let directions = results || [];
            const data= {view:'recipeDetail', title: 'Recipes', message: message, directions:directions,
              ingredients:ingredients, recipeIngredients:recipeIngredients, recipe:recipe,
              recipe:recipe, nav:nav}
              render(res, data);
          })
        });
      })
    });
  }
  const addDirection = function (req, res) {
    const direction = {recipe:req.query.name, direction:req.body.direction, stepNumber: req.body.stepNumber}
    // if this step exists for recipe, do not add
    recipeDAC.getADirection(direction.recipe, direction.stepNumber, function (results) {
      if (results.length) {
        res.redirect('/recipes/recipeDetail/'+direction.recipe+'?error=step%20exists%20for%20directions');
      } else {
        recipeDAC.addDirectionToRecipe(direction, function(results) {
          console.log(`added ${req.body.direction} #${req.body.stepNumber} to ${req.query.name}`);
          getRecipe(req, res);
        })
      }
    })
  }
  const deleteDirection = function (req, res) {
    let a = req.query.name.split('.');
    const direction = {recipeName: a[0], stepNumber:a[1] };
    // if this step exists for recipe, do not add
    recipeDAC.deleteDirectionFromRecipe(req, res, direction, function(results){
      res.send(results);
    })
  }
  return {
    getRecipes : getRecipes,
    addRecipe : addRecipe,
    recipeDetail: recipeDetail,
    getRecipe: getRecipe,
    deleteRecipes:deleteRecipes,
    addIngredient : addIngredient,
    addDirection : addDirection,
    deleteDirection : deleteDirection
  };
};
module.exports = recipeController;
