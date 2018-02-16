const typesDAC = require('../data/typesDAC')();
const utility = require('../utilities/utilities')();

const typesController = (nav) => {
    const getData =  (req, res) => {
        //get categories
        typesDAC.getCategories((categoryList) => {
            typesDAC.getUnits((units) => {
                const message = utility.getMessage(req);
                res.render('types', {
                    title: 'types',
                    message: utility.getMessage(req),
                    units: units,
                    categories: categoryList,
                    nav: nav
                  });
            })
        })
    }

    const deleteCategory =  (req, res) => {
        const category = req.body.categoryName;
        console.log('category:' + category);
        typesDAC.deleteCategory(category, (results)=>{
          res.redirect('/types');
        });
    }

    const newCategory =  (req, res) => {
        const categoryName = {name: req.body.categoryName};
        typesDAC.createCategory(categoryName, (results) => {
            res.redirect('/types');
        });
    }

    const deleteUnit =  (req, res) => {
        const unit = req.body.unitName;
        console.log('unit:' + unit);
        typesDAC.deleteUnit(unit, (results) => {
            res.redirect('/types');
        });
    }

    const newUnit =  (req, res) => {
        const unit = {name: req.body.unitName};
        typesDAC.createUnit(unit, (results) => {
            res.redirect('/types');
        });
    }

    return {
        newCategory: newCategory,
        deleteCategory : deleteCategory,
        newUnit: newUnit,
        deleteUnit : deleteUnit,
        getData: getData

    }
}
module.exports = typesController;