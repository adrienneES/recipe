var pinterestAPI = require('pinterest-api');
const pinterest = pinterestAPI('adricurtis');
var pinData;
    // Get pins from a board (second parameter determines whether you want the results paginated and to include some metadata)
    pinterestAPI.getDataForPins('833658580996442221', function (pins) {
      debugger;
      var data = pins.data[0];
      var recipe =data.rich_metadata.recipe 
      var name = data.name;
      var numIngredients = recipe.categorized_ingredients.length;
      for (let catIngred of recipe.categorized_ingredients) {
        var category = catIngred.category;
        let numIngreds = catIngred.ingredients.length;
        for (var i = 0; i < catIngred.ingredients.length; i++) {
          var ingredient = catIngred.ingredients[i];
          var name = ingredient.name;
          var amt = ingredient.amt;
          console.log(ingredient);
          }
      }
        console.log(v.rich_metadata.recipe);
        if (pins.length == 1) {
          let obj = pin.repin_count;
          console.log(obj);
      }
      else {
        console.log(pins.data);
    }
    });
