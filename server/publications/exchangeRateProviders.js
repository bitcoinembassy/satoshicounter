Meteor.publish('exchangeRateProviders', function() {
  return ExchangeRateProviders.find();
});
