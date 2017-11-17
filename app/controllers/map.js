const express = require('express');
const data = require('../readData.js');

module.exports = {
  registerRouter() {
    const router = express.Router();

    router.post('/', this.getDataPoints);

    return router;
  },

  getDataPoints(req, res) {
    console.log('processing data...');
    var obj = data.calculateData('pr', 'without-regulations');
    console.log(obj);
    res.json(obj);
  },
};
