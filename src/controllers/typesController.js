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

    const newCategory =  (req, res) => {
        console.log(req.body);
        const autoOrder = req.body.autoOrder == 'on' ? 'yes' : 'no';
        const category = {name: req.body.categoryName.toUpperCase(), autoOrder: autoOrder};
        console.log(category);
        typesDAC.createCategory(category, (results) => {
            res.redirect('/types');
        });
    }

    const deleteCategory =  (req, res) => {
        const category = req.body.categoryName;
        console.log('category:' + category+ ";query: req.query.categoryName" +req.query.categoryName);
//        typesDAC.deleteCategory(category, (results)=>{
          res.redirect('/types');
  //      });
    }

    const flipAutoOrder =  (req, res) => {
        req.body.success='didIt';
        console.log(req.body);
        let categoryArray = req.body.category.split('.');
        let autoOrder;
        const category = {name: categoryArray[0], autoOrder: autoOrder}
        if (categoryArray[1]) {
            autoOrder = (categoryArray[1] == 'yes') ? 'no' : 'yes';
            category.autoOrder = autoOrder;
            console.log('flipping');
            console.log(category);
            typesDAC.flipAutoOrder(category, (results)=>{ 
                res.redirect('/types');
            });
        } else {
            console.log('deleting');
            const c= {name: categoryArray[0]};
            typesDAC.deleteCategory(c, (results)=>{
                res.redirect('/types');
            });
        }
    }
    
        const deleteUnit =  (req, res) => {
        const unit = req.body.unitName;
        console.log('unit:' + unit);
        typesDAC.deleteUnit(unit, (results) => {
            res.redirect('/types');
        });
    }

    const newUnit =  (req, res) => {
        const unit = {name: req.body.unitName.toLowerCase()};
        typesDAC.createUnit(unit, (results) => {
            res.redirect('/types');
        });
    }

    return {
        newCategory: newCategory,
        deleteCategory : deleteCategory,
        flipAutoOrder : flipAutoOrder,
        newUnit: newUnit,
        deleteUnit : deleteUnit,
        getData: getData

    }
}
module.exports = typesController;