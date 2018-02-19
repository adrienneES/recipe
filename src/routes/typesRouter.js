import express from 'express';
let typesRouter = express.Router();

const router = (nav) => {
    const typesController = require('../controllers/typesController')(nav);
    typesRouter.get('/',typesController.getData);
    typesRouter.route('/deleteCategory')
        .get(typesController.deleteCategory);
        typesRouter.route('/flipAutoOrder')
        .post(typesController.flipAutoOrder);
    typesRouter.route('/newCategory')
        .post(typesController.newCategory);
    typesRouter.route('/deleteUnit')
        .post(typesController.deleteUnit);
    typesRouter.route('/newUnit')
        .post(typesController.newUnit);

    return typesRouter;
}
module.exports = router;