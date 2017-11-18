const express = require('express');

module.exports = {
  registerRouter() {
    const router = express.Router();

    router.get('/', this.index);

    return router;
  },

  index(req, res) {
    res.render('about');
  },

  
};