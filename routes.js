'use strict';

const express = require('express');
const routes = express.Router();

const application = require('./controllers/application.js');

routes.get('/', application.index);

module.exports = routes;