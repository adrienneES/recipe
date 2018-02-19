import express from 'express';
let pinterestRouter = express.Router();

const router = function (nav) {
    const pinterestController = require('../controllers/pinterestController')(nav);
    pinterestRouter.get('/', pinterestController.getPins);
    pinterestRouter.route('/getPinData').post(pinterestController.getPinData);
    pinterestRouter.route('/addData').post(pinterestController.addData);
    pinterestRouter.route('/getNewBoardData').post(pinterestController.getNewBoardData);
    return pinterestRouter;
}
module.exports = router;
