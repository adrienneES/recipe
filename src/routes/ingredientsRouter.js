var express = require('express');
var ingredientRouter = express.Router();

var router = function (nav) {
  ingredientRouter.get('/', function (req, res) {
    res.render('ingredients', {
      title: 'ingredients',
      nav: nav});
  });

  ingredientRouter.route('/categorynew')
  .post(function (req, res) {
    console.log(req.body.categoryName)
    res.send(req.body);
   });
return ingredientRouter;
}

module.exports = router;
