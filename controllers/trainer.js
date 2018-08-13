'use strict';

const accounts = require('./accounts');
const memberStore = require('../models/member-store');
const logger = require('../utils/logger');

const trainer = {

  index(request, response) {
    const loggedInUser = accounts.getCurrentUser(request);
    const userPrivileges = accounts.validateMemberType(loggedInUser, 'trainer');
    if (!userPrivileges) {
      response.clearCookie('gym_member');
      response.redirect('/login');
    } else {
      const viewData = {
        title: 'Trainer',
        trainer: loggedInUser,
        members: memberStore.getUsersByMemberType('member'),
      };
      logger.info('Members: ' + viewData.members);
      response.render('admin', viewData);
    }
  },
};

module.exports = trainer;