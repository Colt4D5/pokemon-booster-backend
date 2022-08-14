const express = require('express');
const router = express.Router();
const cardsController = require('../controllers/cardsControllers');

router
  .route('/buy-booster')
    .post(cardsController.buyPack);

router
  .route('/open-pack')
    .post(cardsController.openPack);

module.exports = router