const express = require('express');
const data = require('../public/readData.js');

module.exports = {
  registerRouter() {
    const router = express.Router();

    router.post('/', this.getDataPoints);

    return router;
  },

  getDataPoints(req, res) {
     data_r= data.calculateData(req.body.diagnostic,'with-regulations',req.body.year);
     data_nr = data.calculateData(req.body.diagnostic,'without-regulations',req.body.year);
     dataObj = {
       'with-regulations' : data_r,
       'without-regulations': data_nr
     };
     res.json(dataObj);
  },
};
