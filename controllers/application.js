'use strict';

const logger = require('../utils/logger');

const application = {

  index(request, response) {
    const viewData = {
      title: 'Home',
    };
    response.render('index', viewData);
  },
};

module.exports = application;