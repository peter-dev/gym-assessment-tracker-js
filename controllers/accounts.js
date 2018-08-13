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

  register(request, response) {
    const member = request.body;
    member.id = uuid();
    member.memberType = 'member';
    memberStore.addUser(member);
    logger.info(`registering new member: ${member.email}`);
    response.redirect('/login');
  },

  authenticate(request, response) {
    const member = memberStore.getUserByEmail(request.body.email);
    if (member) {
      response.cookie('gym_member', member.email);
      logger.info(`logging in ${member.memberType}: ${member.email}`);
      // check if trainer or member
      if (member.memberType === 'trainer') {
        response.redirect('/admin');
      } else {
        response.redirect('/dashboard');
      }
    } else {
      response.redirect('/login');
    }
  },

  getCurrentUser(request) {
    const userEmail = request.cookies.gym_member;
    return memberStore.getUserByEmail(userEmail);
  },

  validateMemberType(member, memberType) {
    // identify correct user privileges, i.e Gym Member tries to access /admin page but Member is not a Trainer
    if (member.memberType === memberType) {
      return true;
    } else {
      return false;
    }
  },

};

module.exports = accounts;
