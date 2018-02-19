/*var pinterestAPI = require('pinterest-api');
const pinterest = pinterestAPI('adricurtis');
var pinData;
    // Get pins from a board (second parameter determines whether you want the results paginated and to include some metadata)
    pinterestAPI.getDataForPins('833658580996442221', function (pins) {
      var data = pins.data[0];
      debugger;
      var images = data.images;
      var image = images["237x"].url;
      var recipe =data.rich_metadata.recipe 
      var name = data.description;
      var location = data.link;
      var description = data.rich_metadata.description+ "; url:" + location;
      var numIngredients = recipe.categorized_ingredients.length;
      var recipe = {
        name: name, 
        description: description,
        image: image
      };
      console.log(recipe);
      var ingredients  = [];
      var recipeIngredients = [];
      for (let category of data.rich_metadata.recipe.categorized_ingredients) {
        var categoryName = category.category;
        let numIngreds = category.ingredients.length;
        console.log(categoryName);
        for (ing of category.ingredients) {
          var recipeIngredient = {
           name : ing.name,
           amt : ing.amt,
           unit : ing.unit};
          };
          ingredients.push({name: name, category: category.category});
          recipeIngredients.push(recipeIngredient);
      }
      console.log(recipeIngredients);
      console.log(ingredients);
      debugger;

    });
    */
