const ingredientDAC = require('../data/ingredientDAC')();
const ingredientController = function (nav) {


  var getData = function (req, res) {

    ingredientDAC.getCategories(function (results) {
      const categoryList = results;
      ingredientDAC.getIngredients(function (results) {
        const ingredientList = results;
        const utility = require('../utilities/utilities')();
        const message = utility.getMessage(req);
        res.render('ingredients', {
          title: 'ingredients',
          message: message,
          categories: categoryList,
          ingredients: ingredientList,
          nav: nav
        });
      });
    });
  }

  const newCategory = function (req, res) {
    const categoryName = {name: req.body.categoryName};
    ingredientDAC.createCategory(categoryName, function(results) {
      res.redirect('/ingredients');
    });
  }

  const getCategories = function (db, callback) {
    const categoryCollection = db.collection('categories');
    if (categoryCollection) {
      categoryCollection.find({}).toArray(function(err, data) {
        callback(data);
      });
      }
  }
  const newIngredient = function (req, res) {
    const staple = req.body.staple ? 'yes' : 'no';
    const ingredient = {category : req.body.ingredientCategory, 
      name: req.body.ingredientName,staple: staple};
      ingredientDAC.getIngredient(req.body.ingredientName, function(results) {
        if (results) {
          res.redirect('/ingredients?error=ingredient%20exists%20already');
        } else {
          ingredientDAC.newIngredient(ingredient, (results)=>{
                res.redirect('/ingredients?success=added');
              });
        }
      });
  };

  const deleteCategory = function (req, res) {
    const category = req.body.categoryName;
    console.log('category:' + category);
    ingredientDAC.deleteCategory(category, (results)=>{
      res.redirect('/ingredients');
    });
  }

  const deleteIngredient = function (req, res) {
    const ingredientName = req.body.ingredientName || req.query.ingredientName;
    console.log('ingredientName:' + ingredientName);
    ingredientDAC.deleteIngredient(ingredientName, (results) => {
      res.redirect('/ingredients');
    })
  }

  return {
    deleteCategory : deleteCategory,
    newIngredient : newIngredient,
    getData:getData,
    deleteIngredient:deleteIngredient,
    newCategory: newCategory,
  };
};
module.exports = ingredientController;
