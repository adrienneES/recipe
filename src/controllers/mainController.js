const recipeDAC = require('../data/recipeDAC')();
const mainController = function (nav) {
    const getData = function (req, res) {

        recipeDAC.getRecipesForWeek((results) => {
            res.render('index', {
                title: 'food planner',
                recipes:results,
                nav: nav
            });
        })
    }
    return {
        getData : getData
    }
}
module.exports = mainController;