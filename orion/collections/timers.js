Timers.attachSchema(new SimpleSchema({
  exchangeRateProvider: {
    type: String
  },
  timeBeforeNextRefresh: {
    type: Number,
    optional: true
  }
}));
