Session.setDefault('buy.btc.paymentMethod', 'Cash');

var currencies = Meteor.subscribe('currencies');

var exchangeRates = Meteor.subscribe('exchangeRates');

Tracker.autorun(function() {
  if (exchangeRates.ready()) {
    var exchangeRate = ExchangeRates.findOne({fromCurrency: 'CAD', toCurrency: 'BTC'});

    var marketPrice = exchangeRate.value;
    Session.set('buy.marketPrice', marketPrice);

    var companyPrice = marketPrice * (1 + exchangeRate.percentageFee / 100);
    Session.set('buy.companyPrice', companyPrice);

    Session.set('buy.flatFee', exchangeRate.flatFee);
  }
});

var paymentMethods = Meteor.subscribe('paymentMethods');

Tracker.autorun(function() {
  if (paymentMethods.ready()) {
    var paymentMethod = PaymentMethods.findOne({name: Session.get('buy.btc.paymentMethod')});
    var percentageFee = Session.get('buy.fromAmount') * (paymentMethod.percentageFee / 100);
    Session.set('buy.paymentMethodFee', percentageFee + paymentMethod.flatFee);
  }
});

AutoForm.debug();
