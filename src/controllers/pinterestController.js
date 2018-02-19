import pinterestAPI from 'pinterest-api';
const utility = require('../utilities/utilities')();
const typesDAC = require('../data/typesDAC')();
const ingredientDAC = require('../data/ingredientDAC')();
const recipeDAC = require('../data/recipeDAC')();
const pinterestController = (nav) => {
    const pinterest = pinterestAPI('adricurtis');
    const render = (res, data) => {
        res.render('pinterest', {
            title: 'pinterest',
            id: data.id,
            boardName: data.boardName,
            ids: data.ids,
            message: data.message,
            recipe: data.recipe ,
            categories: data.categories,
            recipeIngredients : data.recipeIngredients,
            ingredients : data.ingredients,
      nav: nav});
    }
    const clearData = () => {
        return {
            id : 0,
            recipe: {},
            boardName: '',
            message: '',
            categories: [],
            ids: [],
            recipeIngredients : [],
            ingredients : []
        };
    }
    const getPins = (req,res ) => {
        console.log(`**getPins**`);
        const boardName = req.body.boardName || 'dinner';
        const message = utility.getMessage(req);
        const data = clearData();
        data.message = message;
        data.boardName = boardName;
        getBoardData(boardName, (ids) => {
            data.ids = ids;
            render(res, data);
        })
    }
    const getPinData = (req, res) => {
        const id = req.body.pin || req.query.id;
        const boardName = req.body.boardName || 'dinner';
        console.log(`**getPinData ${id}**`);
        let data = clearData();
        data.id = id;
        data.boardName = boardName;
        pinterestAPI.getDataForPins(id, function (pins) {
            data = getData(null, id, pins);
            getBoardData(boardName, (ids) => {
                data.ids = ids;
                render(res, data);
            })
        });
    }
    const getData = function (name, id, pins)  {
        let data = clearData();
        data.id = id;
        const pinData = pins.data[0];
        if (pinData) {
            data.recipe = {
                name: name || pinData.description, 
                description: `url: ${pinData.link}`,
                recipeImage: pinData.images["237x"].url
            };
            if (pinData.rich_metadata) { 
                if (pinData.rich_metadata.recipe) {
                    for (let category of pinData.rich_metadata.recipe.categorized_ingredients) {
                        var categoryName = category.category.toUpperCase();
                        data.categories.push({name: categoryName, autoOrder:'yes'});
                        for (let ingredient of category.ingredients) {
                            var recipeIngredient = {
                                recipe : data.recipe.name,
                                ingredient : ingredient.name,
                                quantity : ingredient.quantity,
                                unit : ingredient.unit
                            };
                            data.ingredients.push({name: ingredient.name, category: categoryName});
                            data.recipeIngredients.push(recipeIngredient);
                        };
                    }
                }
            }
        }
        return data;
    };
    const addData = (req, res) => {
        const id = req.query.id;
        console.log(`**addData req.query.id, id: ${id}**`);
        const recipeName = req.body.newName;
        let data = clearData();
        data.id = id;
        pinterestAPI.getDataForPins(id, function (pins) {
            const returnedData = getData(recipeName, id, pins);
            typesDAC.addCategories(returnedData.categories, (results) => {
                // add ingredients
                ingredientDAC.newIngredients(returnedData.ingredients, (results) => {
                    // add recipe ingredients
                    recipeDAC.addIngredientsToRecipes(returnedData.recipeIngredients, (results) => {
                        recipeDAC.insertNewRecipe(returnedData.recipe, (results) => {
                            req.query.success = `Recipe ${returnedData.recipe.name} added`;
                            getPins(req, res);
                        })
                    })
                })
            });
        });
    }
    const getBoardData = (boardName, callback) => {
        console.log(`getBoardData`);
        pinterest.getPinsFromBoard(boardName, true, function (pins) {
            let ids = [];
            for (let data of pins.data) {
                ids.push({id: data.id, name: data.description.replace(/^(.{20}[^\s]*).*/, "$1")});
            }
            callback(ids);
        });
    }
    const getNewBoardData = (req, res) => {
        console.log(req.body);
        getPins(req, res);
    }
    return {
        getPins : getPins,
        getPinData : getPinData,
        addData : addData,
        getNewBoardData : getNewBoardData
    }
};
module.exports = pinterestController;