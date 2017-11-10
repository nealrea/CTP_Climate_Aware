const express = require('express');
const data = require('../public/sampleData.js');

module.exports = {
  registerRouter() {
    const router = express.Router();

    router.post('/', this.getDataPoints);

    return router;
  },

  getDataPoints(req, res) {
    randData = req.body.year%2 == 0 ? data.testDataNoReg: data.testDataYesReg;
    res.json(randData);
  },
};
