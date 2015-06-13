Timers = new Meteor.Collection('timers');

Timers.attachSchema(new SimpleSchema({
  exchangeRate: {
    type: String
  },
  value: {
    type: Number,
    optional: true
  }
}));
