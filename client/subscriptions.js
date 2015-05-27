var currentPrice = Meteor.subscribe('currentPrice');

Tracker.autorun(function () {
  if (currentPrice.ready()) {
    var price = Prices.findOne();
    Session.set('askPrice', price.askPrice);
    Session.set('buyPrice', price.buyPrice);
  }
});

var paymentMethods = Meteor.subscribe('paymentMethods');

Tracker.autorun(function () {
  if (paymentMethods.ready()) {
    var cash = PaymentMethods.findOne({name: 'Cash'});
    Session.set('flatFee', cash.buyPrice.flatFee);
  }
});
