Meteor.publish('currencies', function() {
  return Currencies.find();
});

Meteor.publish('exchangeRates', function() {
  return ExchangeRates.find();
});

Meteor.publish('paymentMethods', function() {
  return PaymentMethods.find();
});

Meteor.publish('timers', function() {
  return Timers.find();
});

Meteor.publish('trades', function() {
  return Trades.find({}, {sort: {createdAt: -1}, limit: 40});
});
