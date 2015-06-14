Meteor.publish('timers', function() {
  return Timers.find();
});
