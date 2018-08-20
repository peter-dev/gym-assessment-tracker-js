'use strict';

const _ = require('lodash');
const JsonStore = require('./json-store');

const memberStore = {

  store: new JsonStore('./models/assessment-store.json', {assessments: []}),
  collection: 'assessments',

  getAllAssessments() {
    return this.store.findAll(this.collection);
  },

  getMemberAssessments(memberId) {
    return this.store.findBy(this.collection, {memberId: memberId});
  },

  getAssessmentById(id) {
    return this.store.findOneBy(this.collection, {id: id});
  },

  addAssessment(assessment) {
    this.store.add(this.collection, assessment);
    this.store.save();
  },

  deleteAssessment(id) {
    const assessment = this.getAssessmentById(id);
    this.store.remove(this.collection, assessment);
    this.store.save();
  },

  updateAssessment(assessment) {
    this.store.update(this.collection, assessment);
    this.store.save();
  }
};

module.exports = memberStore;