Meteor.publish('exchangeRates', function() {
  return ExchangeRates.find();
});
