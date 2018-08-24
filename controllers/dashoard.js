'use strict';

const accounts = require('./accounts');
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
      // check for Missed goals each time dashboard is rendered (event based action)
      loggedInUser.goals = analytics.updateMissedGoals(loggedInUser.goals);
      goalStore.updateGoal(loggedInUser.goals);
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
      // prepare new assessment based on user input
      const assessment = request.body;
      assessment.id = uuid();
      assessment.memberId = loggedInUser.id;
      assessment.comment = '';
      assessment.date = new Date();
      // determine the trend based on the new assessment
      assessment.trend = analytics.determineTrend(loggedInUser, assessment);
      assessmentStore.addAssessment(assessment);
      logger.info(
          `adding new assessment with date: ${assessment.date} for member: ${loggedInUser.email}`);
      // get member goals from the store and sort the goals by date descending
      let goals = goalStore.getMemberGoals(loggedInUser.id).sort(
          function (a, b) {
            return new Date(b.status_date) - new Date(a.status_date);
          });
      // recalculate goals each time new assessment is added (event based action)
      goals = analytics.updateGoals(goals, assessment);
      goalStore.updateGoal(goals);

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
      // get assessment id from the uri and delete the assessment
      const id = request.params.id;
      assessmentStore.deleteAssessment(id);
      logger.info(
          `deleting assessment with id ${id} for member: ${loggedInUser.email}`);
      response.redirect('/dashboard');
    }
  },

  addGoal(request, response) {
    const loggedInUser = accounts.getCurrentUser(request);
    const userPrivilegesMember = accounts.validateMemberType(loggedInUser,
        'member');
    const userPrivilegesTrainer = accounts.validateMemberType(loggedInUser,
        'trainer');
    if (!userPrivilegesMember && !userPrivilegesTrainer) {
      response.clearCookie('gym_member');
      response.redirect('/login');
    } else {
      // get member id from the uri
      const memberId = request.params.id;
      // prepare new goal based on user input
      const goal = request.body;
      goal.id = uuid();
      goal.memberId = memberId;
      goal.status_date = new Date();
      goal.target_date = new Date(request.body.target_date);
      // if user entered date in the past, the goal will be set to 'Missed'
      goal.status = (goal.target_date > goal.status_date) ? 'Open' : 'Missed';
      goal.units = (goal.type === 'Weight') ? 'kg' : 'cm';
      // get member assessments and determine goal direction (gain or lose)
      goal.direction = analytics.determineGoalDirection(
          assessmentStore.getMemberAssessments(memberId), goal);
      goalStore.addGoal(goal);
      logger.info(
          `adding new goal with date: ${goal.status_date} for member id: ${memberId}`);
      logger.info(goal);
      // goal added by the user, redirect to dashboard
      if (userPrivilegesMember) {
        response.redirect('/dashboard');
      }
      // goal added by the trainer, redirect to trainer page
      if (userPrivilegesTrainer) {
        response.redirect(`/admin/members/${memberId}`);
      }
    }
  }
};

module.exports = dashboard;