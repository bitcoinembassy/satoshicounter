Timers = new Meteor.Collection('timers');

Timers.attachSchema(new SimpleSchema({
  currencyCode: {
    type: String
  },
  value: {
    type: Number,
    optional: true
  }
}));
