Meteor.publish('companyPrice', function (baseCurrencySlug, counterCurrencySlug) {
  check(baseCurrencySlug, String);
  check(counterCurrencySlug, String);

  var baseCurrency = Currencies.findOne({slug: baseCurrencySlug});
  var counterCurrency = Currencies.findOne({slug: counterCurrencySlug});

  return CompanyPrices.find({baseCurrency: baseCurrency._id});
});
