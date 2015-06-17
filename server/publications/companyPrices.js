Meteor.publish('companyPrice', function(baseCurrencyCode, counterCurrencyCode) {
  check(baseCurrencyCode, String);
  check(counterCurrencyCode, String);

  var baseCurrency = Currencies.findOne({code: baseCurrencyCode});
  var counterCurrency = Currencies.findOne({code: counterCurrencyCode});

  return CompanyPrices.find({baseCurrency: baseCurrency._id, counterCurrency: counterCurrency._id});
});
