import mongo from 'mongodb';
var mongodb = mongo.MongoClient;
var dataController = function (nav) {
    var url = 'mongodb://localhost:27017/tempDatabase';
    var getData = function(req, res) {
        res.render('data', {
            title: 'data',
            recipes: [],
            week: [],
            recipesIngredients: [],
            ingredients:[],
            collection: '',
            nav: nav});
  }
  var showRecipes = function(req, res) {
    mongodb.connect(url, function (err, db) {
      var collection = db.collection('recipes');
      collection.find({}).toArray(function (err, results) {
        res.render('data', {
          title: 'data',
          recipes: results,
          recipesIngredients: [],
          week: [],
          ingredients:[],
          collection: 'Recipes',
          nav: nav
        });
      } );
    });
  }
  var deleteRecipes = function (req, res) {
    console.log(`deleting recipes`)
    mongodb.connect(url, function (err, db) {
      var collection = db.collection('recipes');
        collection.remove( {}, function (err, results) {
          getData(req, res);
        });
      });
  }
  var showRecipeIngredients = function (req, res) {
    mongodb.connect(url, function (err, db) {
      var collection = db.collection('recipeIngredients');
      collection.find({}).toArray(function (err, results) {
        res.render('data', {
          title: 'data',
          recipes: [],
          recipesIngredients: results,
          collection: 'Recipe Ingredients',
          week: [],
          ingredients:[],
          nav: nav
        });
      } );
    });
  }
  var deleteRecipeIngredients = function(req, res) {
    mongodb.connect(url, function (err, db) {
      var collection = db.collection('recipeIngredients');
      collection.remove({}, function(err, results) {
        getData(req, res);
      } );
      });
  }
  var showIngredients = function(req, res) {
    mongodb.connect(url, function (err, db) {
      var collection = db.collection('ingredients');
      collection.find({}).toArray(function (err, results) {
        res.render('data', {
          title: 'data',
          recipes: [],
          recipesIngredients: [],
          ingredients: results,
          week: [],
          collection: 'Ingredients',
          nav: nav
        });
      } );
    });
      
  }
  var deleteIngredients = function(req, res) {
    mongodb.connect(url, function (err, db) {
      var collection = db.collection('ingredients');
      collection.remove({}, function(err, results) {
        getData(req, res);
      } );
      });
  }
  var showWeek = function(req, res) {
    mongodb.connect(url, function (err, db) {
      var collection = db.collection('week');
      collection.find({}).toArray(function (err, results) {
        console.log(results);
        res.render('data', {
          title: 'data',
          recipes: [],
          recipesIngredients: [],
          ingredients: results,
          week: results,
          collection: 'Week',
          nav: nav
        });
      } );
    });
      
  }
  var deleteWeek = function(req, res) {
    mongodb.connect(url, function (err, db) {
      var collection = db.collection('week');
      collection.remove({}, function(err, results) {
        getData(req, res);
      } );
      });
  }
  return {
        getData:getData,
        showRecipes:showRecipes,
        showRecipeIngredients:showRecipeIngredients,
        deleteRecipeIngredients:deleteRecipeIngredients,
        deleteRecipes:deleteRecipes,
        showIngredients: showIngredients,
        deleteIngredients:deleteIngredients,
        showWeek: showWeek,
        deleteWeek:deleteWeek
    }
  };

module.exports = dataController;
