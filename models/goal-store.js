'use strict';

const _ = require('lodash');
const JsonStore = require('./json-store');

const goalStore = {

  store: new JsonStore('./models/goal-store.json', {goals: []}),
  collection: 'goals',

  getAllGoals() {
    return this.store.findAll(this.collection);
  },

  getMemberGoals(memberId) {
    return this.store.findBy(this.collection, {memberId: memberId});
  },

  getGoalById(id) {
    return this.store.findOneBy(this.collection, {id: id});
  },

  addGoal(goal) {
    this.store.add(this.collection, goal);
    this.store.save();
  },

  deleteGoal(id) {
    const goal = this.getGoalById(id);
    this.store.remove(this.collection, goal);
    this.store.save();
  },

  updateGoal(goal) {
    this.store.update(this.collection, goal);
    this.store.save();
  }
};

module.exports = goalStore;