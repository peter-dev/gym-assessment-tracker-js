'use strict';

const accounts = require('./accounts');
const memberStore = require('../models/member-store');
const logger = require('../utils/logger');
const analytics = require('../utils/analytics');

const dashboard = {

  index(request, response) {
    const loggedInUser = accounts.getCurrentUser(request);
    const userPrivileges = accounts.validateMemberType(loggedInUser, 'member');
    if (!userPrivileges) {
      response.clearCookie('gym_member');
      response.redirect('/login');
    } else {
      const viewData = {
        title: 'Dashboard',
        member: loggedInUser,
        stats: analytics.generateMemberStats(loggedInUser),
      };
      logger.info(viewData.stats);
      response.render('dashboard', viewData);
    }
  },
};

module.exports = dashboard;