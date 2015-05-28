var currencies = Meteor.subscribe('currencies');

Tracker.autorun(function () {
  if (currencies.ready()) {
    var canadianDollar = Currencies.findOne({code: 'CAD'});
    Session.set('CAD.askPrice', canadianDollar.askPrice);
    Session.set('buyPrice', canadianDollar.buyPrice);

    var unitedStatesDollar = Currencies.findOne({code: 'USD'});
    Session.set('USD.askPrice', unitedStatesDollar.askPrice);
  }
});

var paymentMethods = Meteor.subscribe('paymentMethods');

Tracker.autorun(function () {
  if (paymentMethods.ready()) {
    var cash = PaymentMethods.findOne({name: 'Cash'});
    Session.set('cash.buyPrice.flatFee', cash.buyPrice.flatFee);

    var debit = PaymentMethods.findOne({name: 'Debit'});
    Session.set('debit.buyPrice.flatFee', debit.buyPrice.flatFee);

    var credit = PaymentMethods.findOne({name: 'Credit'});
    Session.set('credit.buyPrice.flatFee', credit.buyPrice.flatFee);

    Session.set('buyPrice.flatFee', cash.buyPrice.flatFee);
    Session.set('paymentMethod', 'cash');
  }
});
