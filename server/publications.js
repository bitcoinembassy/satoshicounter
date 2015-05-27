Meteor.publish('currentPrice', function() {
  return Prices.find({}, {sort: {createdAt: -1}, limit: 1});
});

Meteor.publish('paymentMethods', function() {
  return PaymentMethods.find();
});

Meteor.publish('trades', function() {
  return Trades.find({}, {sort: {createdAt: -1}, limit: 40});
});
