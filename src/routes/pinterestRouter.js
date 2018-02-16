import express from 'express';
let pinterestRouter = express.Router();

const router = function (nav) {
    const pinterestController = require('../controllers/pinterestController')(nav);
    pinterestRouter.get('/', pinterestController.getPins);
    return pinterestRouter;
}
module.exports = router;
