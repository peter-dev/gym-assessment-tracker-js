'use strict';

const memberStore = require('../models/member-store');
const logger = require('../utils/logger');
const uuid = require('uuid');

const accounts = {

  index(request, response) {
    const viewData = {
      title: 'Home',
    };
    response.render('index', viewData);
  },

  login(request, response) {
    const viewData = {
      title: 'Login',
    };
    response.render('login', viewData);
  },

  logout(request, response) {
    response.clearCookie('gym_member');
    response.redirect('/');
  },

  signup(request, response) {
    const viewData = {
      title: 'Signup',
    };
    response.render('signup', viewData);
  },

  about(request, response) {
    const loggedInUser = accounts.getCurrentUser(request);
    const userPrivileges = accounts.validateMemberType(loggedInUser, 'member');
    if (!userPrivileges) {
      response.clearCookie('gym_member');
      response.redirect('/login');
    } else {
      const viewData = {
        title: 'About',
      };
      response.render('about', viewData);
    }
  },

  settings(request, response) {
    const loggedInUser = accounts.getCurrentUser(request);
    const userPrivileges = accounts.validateMemberType(loggedInUser, 'member');
    if (!userPrivileges) {
      response.clearCookie('gym_member');
      response.redirect('/login');
    } else {
      const viewData = {
        title: 'Settings',
        member: loggedInUser,
      };
      response.render('settings', viewData);
    }
  },

  register(request, response) {
    const member = request.body;
    // check if email address is already registered in the system
    const exists = memberStore.getUserByEmail(request.body.email);
    if (exists) {
      logger.info(`email address ${member.email} is already registered`)
    } else {
      member.id = uuid();
      member.memberType = 'member';
      memberStore.addUser(member);
      logger.info(
          `registering new member: ${member.email} with id: ${member.id}`);
      response.redirect('/login');
    }
  },

  authenticate(request, response) {
    const email = request.body.email;
    const password = request.body.password;
    logger.info(`attempting to authenticate with ${email} : ${password}`);
    const member = memberStore.getUserByEmail(request.body.email);
    // authentication successful
    if (member && member.password === password) {
      response.cookie('gym_member', email);
      logger.info(`logging in ${member.memberType}: ${email}`);
      // check if trainer or member
      if (member.memberType === 'trainer') {
        response.redirect('/admin');
      } else {
        response.redirect('/dashboard');
      }
    } else {
      // authentication failed
      logger.info('authentication failed');
      response.redirect('/login');
    }
  },

  update(request, response) {
    const loggedInUser = accounts.getCurrentUser(request);
    const userPrivileges = accounts.validateMemberType(loggedInUser, 'member');
    if (!userPrivileges) {
      response.clearCookie('gym_member');
      response.redirect('/login');
    } else {
      if (request.body.name !== null && request.body.name !== '') {
        loggedInUser.name = request.body.name;
      }
      if (request.body.gender !== null && request.body.gender !== '') {
        loggedInUser.gender = request.body.gender;
      }
      if (request.body.password !== null && request.body.password !== '') {
        loggedInUser.password = request.body.password;
      }
      if (request.body.address !== null && request.body.address !== '') {
        loggedInUser.address = request.body.address;
      }
      if (request.body.height !== null && request.body.height !== '') {
        loggedInUser.height = request.body.height;
      }
      if (request.body.startWeight !== null && request.body.startWeight
          !== '') {
        loggedInUser.startWeight = request.body.startWeight;
      }
      memberStore.updateUser(loggedInUser);
      response.redirect('/dashboard');
    }
  },

  getCurrentUser(request) {
    const userEmail = request.cookies.gym_member;
    return memberStore.getUserByEmail(userEmail);
  },

  validateMemberType(member, memberType) {
    // identify correct user privileges, i.e Gym Member tries to access /admin page but Member is not a Trainer
    if (member) {
      return (member.memberType === memberType);
    } else {
      return false;
    }
  },

};

module.exports = accounts;
