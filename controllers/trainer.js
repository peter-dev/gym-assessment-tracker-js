'use strict';

const accounts = require('./accounts');
const memberStore = require('../models/member-store');
const assessmentStore = require('../models/assessment-store');
const goalStore = require('../models/goal-store');
const logger = require('../utils/logger');
const analytics = require('../utils/analytics');

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
      // retrieve assessments from the store for each member on the list
      for (let i = 0; i < viewData.members.length; i++) {
        viewData.members[i].assessments = assessmentStore.getMemberAssessments(
            viewData.members[i].id).length;
      }
      response.render('admin', viewData);
    }
  },

  showMember(request, response) {
    const loggedInUser = accounts.getCurrentUser(request);
    const userPrivileges = accounts.validateMemberType(loggedInUser, 'trainer');
    if (!userPrivileges) {
      response.clearCookie('gym_member');
      response.redirect('/login');
    } else {
      // get user id from the uri
      const id = request.params.id;
      const member = memberStore.getUserById(id);
      // get member assessments from the store and sort the assessments by date descending
      let assessments = assessmentStore.getMemberAssessments(id).sort(
          function (a, b) {
            return new Date(b.date) - new Date(a.date);
          });
      // get user goals from the store and sort the goals by the status update date descending
      let goals = goalStore.getMemberGoals(id).sort(function (a, b) {
        return new Date(b.status_date) - new Date(a.status_date);
      });
      // check for Missed goals each time dashboard is rendered (event based action)
      goals = analytics.updateMissedGoals(goals);
      goalStore.updateGoal(goals);
      const viewData = {
        title: 'Trainer',
        trainer: loggedInUser,
        member: member,
        assessments: assessments,
        goals: goals,
        stats: analytics.generateMemberStats(member, assessments, goals),
      };
      response.render('assessments', viewData);
    }
  },

  deleteMember(request, response) {
    const loggedInUser = accounts.getCurrentUser(request);
    const userPrivileges = accounts.validateMemberType(loggedInUser, 'trainer');
    if (!userPrivileges) {
      response.clearCookie('gym_member');
      response.redirect('/login');
    } else {
      // get user id from the uri and delete the user
      const id = request.params.id;
      memberStore.deleteUser(id);
      logger.info(
          `deleting member with user id: ${id}`);
      response.redirect('/admin');
    }
  },

  updateAssessment(request, response) {
    const loggedInUser = accounts.getCurrentUser(request);
    const userPrivileges = accounts.validateMemberType(loggedInUser, 'trainer');
    if (!userPrivileges) {
      response.clearCookie('gym_member');
      response.redirect('/login');
    } else {
      // get assessment id from the uri and update the comment
      const id = request.params.id;
      const assessment = assessmentStore.getAssessmentById(id);
      assessment.comment = request.body.comment;
      assessmentStore.updateAssessment(assessment);
      response.redirect(`/admin/members/${assessment.memberId}`);
    }
  }
};

module.exports = trainer;