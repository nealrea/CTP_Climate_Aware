const express = require('express');
const data = require('../public/readData.js');

module.exports = {
  registerRouter() {
    const router = express.Router();

    router.post('/', this.getDataPoints);

    return router;
  },

  getDataPoints(req, res) {
    currData = data.calculateData(req.body.diagnostic,req.body.regMode,req.body.year);
    //console.log(currData);
    res.json(currData);
  },
};
