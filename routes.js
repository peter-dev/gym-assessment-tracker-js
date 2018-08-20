'use strict';

const express = require('express');
const routes = express.Router();

const accounts = require('./controllers/accounts');
const trainer = require('./controllers/trainer');
const dashboard = require('./controllers/dashoard');

// Accounts
routes.get('/', accounts.index);
routes.get('/signup', accounts.signup);
routes.get('/login', accounts.login);
routes.get('/logout', accounts.logout);
routes.get('/about', accounts.about);
routes.get('/settings', accounts.settings);
routes.post('/register', accounts.register);
routes.post('/authenticate', accounts.authenticate);
routes.post('/update', accounts.update);

// Member Home Page
routes.get('/dashboard', dashboard.index);
routes.get('/dashboard/deleteassessment/:id', dashboard.deleteAssessment);
routes.post('/dashboard/addassessment', dashboard.addAssessment);

// Trainer Home Page
routes.get('/admin', trainer.index);
routes.get('/admin/members/:id', trainer.showMember);
routes.get('/admin/deletemember/:id', trainer.deleteMember);
routes.post('/admin/updateassessment/:id', trainer.updateAssessment);

module.exports = routes;
