'use strict';

const express = require('express');
const routes = express.Router();

const accounts = require('./controllers/accounts');
const trainer = require('./controllers/trainer');
const dashboard = require('./controllers/dashoard');

routes.get('/', accounts.index);

routes.get('/signup', accounts.signup);
routes.get('/login', accounts.login);
routes.get('/logout', accounts.logout);
routes.post('/register', accounts.register);
routes.post('/authenticate', accounts.authenticate);
routes.get('/settings', accounts.settings);

routes.get('/dashboard', dashboard.index);

routes.get('/admin', trainer.index);

module.exports = routes;
