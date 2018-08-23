'use strict';

const accounts = require('./accounts');
const memberStore = require('../models/member-store');
const assessmentStore = require('../models/assessment-store');
const goalStore = require('../models/goal-store');
const logger = require('../utils/logger');
const analytics = require('../utils/analytics');
const uuid = require('uuid');

const dashboard = {

  index(request, response) {
    const loggedInUser = accounts.getCurrentUser(request);
    const userPrivileges = accounts.validateMemberType(loggedInUser, 'member');
    if (!userPrivileges) {
      response.clearCookie('gym_member');
      response.redirect('/login');
    } else {
      // get member assessments from the store and sort the assessments by date descending
      loggedInUser.assessments = assessmentStore.getMemberAssessments(
          loggedInUser.id).sort(function (a, b) {
        return new Date(b.date) - new Date(a.date);
      });
      // get member goals from the store and sort the goals by date descending
      loggedInUser.goals = goalStore.getMemberGoals(
          loggedInUser.id).sort(function (a, b) {
        return new Date(b.status_date) - new Date(a.status_date);
      });
      const viewData = {
        title: 'Dashboard',
        member: loggedInUser,
        stats: analytics.generateMemberStats(loggedInUser),
      };
      response.render('dashboard', viewData);
    }
  },

  addAssessment(request, response) {
    const loggedInUser = accounts.getCurrentUser(request);
    const userPrivileges = accounts.validateMemberType(loggedInUser, 'member');
    if (!userPrivileges) {
      response.clearCookie('gym_member');
      response.redirect('/login');
    } else {
      // get member assessments
      loggedInUser.assessments = assessmentStore.getMemberAssessments(
          loggedInUser.id);
      // prepare new assessment based on form input
      const assessment = request.body;
      assessment.id = uuid();
      assessment.memberId = loggedInUser.id;
      assessment.comment = '';
      assessment.date = new Date();
      // determine new trend
      assessment.trend = analytics.determineTrend(loggedInUser, assessment);
      assessmentStore.addAssessment(assessment);
      logger.info(
          `adding new assessment with date: ${assessment.date} for member: ${loggedInUser.email}`);
      response.redirect('/dashboard');
    }
  },

  deleteAssessment(request, response) {
    const loggedInUser = accounts.getCurrentUser(request);
    const userPrivileges = accounts.validateMemberType(loggedInUser, 'member');
    if (!userPrivileges) {
      response.clearCookie('gym_member');
      response.redirect('/login');
    } else {
      // get id from the uri and delete the assessment
      const id = request.params.id;
      assessmentStore.deleteAssessment(id);
      logger.info(
          `deleting assessment with id ${id} for member: ${loggedInUser.email}`);
      response.redirect('/dashboard');
    }
  },

  addGoal(request, response) {
    const loggedInUser = accounts.getCurrentUser(request);
    const userPrivileges = accounts.validateMemberType(loggedInUser, 'member');
    if (!userPrivileges) {
      response.clearCookie('gym_member');
      response.redirect('/login');
    } else {
      // TODO
    }

    let input = request.body;
    input.goal_raw_date = new Date(input.goal_date);
    logger.info('Goal retrieved');
    logger.info(input);
  }
};

module.exports = dashboard;