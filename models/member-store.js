'use strict';

const _ = require('lodash');
const JsonStore = require('./json-store');

const memberStore = {

  store: new JsonStore('./models/member-store.json', {users: []}),
  collection: 'users',

  getAllUsers() {
    return this.store.findAll(this.collection);
  },

  addUser(user) {
    this.store.add(this.collection, user);
    this.store.save();
  },

  updateUser(user) {
    this.store.update(this.collection, user);
    this.store.save();
  },

  getUserById(id) {
    return this.store.findOneBy(this.collection, {id: id});
  },

  getUserByEmail(email) {
    return this.store.findOneBy(this.collection, {email: email});
  },

  getUsersByMemberType(memberType) {
    return this.store.findBy(this.collection, {memberType: memberType});
  }
};

module.exports = memberStore;