const ingredientDAC = require('../data/ingredientDAC')();
const typesDAC = require('../data/typesDAC')();

const ingredientController =  (nav) => {

  var getData =  (req, res) => {
    const ingredientName = req.body.ingredientName || req.query.ingredientName
    console.log(ingredientName);
    ingredientDAC.getIngredient(ingredientName, (ingredientData) => { 
      console.log(ingredientData);
      let ingredient = {};
      if (ingredientData) {
        ingredient.name = ingredientData.name, 
        ingredient.category = ingredientData.category
      }
      // get the categories 
      typesDAC.getCategories(null, (results) => {
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
            name : ingredient.name? ingredient.name : '',
            category : ingredient.category? ingredient.category : '',
            nav: nav});
        });
      });
      });
  }

  const saveIngredient =  (req, res) => {
    const ingredient = {category : req.body.ingredientCategory, 
      name: req.body.ingredientName};
      ingredientDAC.getIngredient(req.body.ingredientName, (results) => {
        if (results) {
          // want to update it
          ingredientDAC.updateIngredient(ingredient, (results) => {
            res.redirect('/ingredients?success=updated');
          });
        } else {
          ingredientDAC.saveIngredient(ingredient, (results) => {
                res.redirect('/ingredients?success=added');
              });
        }
      });
  };

  const deleteIngredient =  (req, res) => {
    const ingredientName = req.body.ingredientName || req.query.ingredientName;
    console.log(`ingredientName = ${ingredientName}`);
    ingredientDAC.deleteIngredient(ingredientName, (results) => {
      res.redirect('/ingredients');
    })
  }
  const editIngredient = (req, res) => {
    getData(req, res);
    
  }

  return {
    saveIngredient : saveIngredient,
      getData:getData,
    deleteIngredient:deleteIngredient,
    editIngredient : editIngredient
  };
};
module.exports = ingredientController;
