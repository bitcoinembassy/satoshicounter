Meteor.publish('currencies', function() {
  return Currencies.find();
});
