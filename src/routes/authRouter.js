import express from 'express';
let authRouter = express.Router();

const router = function () {
  authRouter.route('/signup')
    .post(function (req, res) {
      console.log(req.body);
    })
  return authRouter;
}
module.exports = router;
