const ingredientDAC = require('../data/ingredientDAC')();
const typesDAC = require('../data/typesDAC')();

const ingredientController =  (nav) => {

  var getData =  (req, res) => {

    // get the categories 
    typesDAC.getCategories( (results) => {
      const categoryList = results;
      ingredientDAC.getIngredients( (results) => {
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

  const newIngredient =  (req, res) => {
    const staple = req.body.staple ? 'yes' : 'no';
    const ingredient = {category : req.body.ingredientCategory, 
      name: req.body.ingredientName,staple: staple};
      ingredientDAC.getIngredient(req.body.ingredientName, (results) => {
        if (results) {
          res.redirect('/ingredients?error=ingredient%20exists%20already');
        } else {
          ingredientDAC.newIngredient(ingredient, (results) => {
                res.redirect('/ingredients?success=added');
              });
        }
      });
  };

  const deleteIngredient =  (req, res) => {
    const ingredientName = req.body.ingredientName || req.query.ingredientName;
    ingredientDAC.deleteIngredient(ingredientName, (results) => {
      res.redirect('/ingredients');
    })
  }

  return {
    newIngredient : newIngredient,
    getData:getData,
    deleteIngredient:deleteIngredient,
  };
};
module.exports = ingredientController;
