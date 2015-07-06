Meteor.publishComposite('companyPrice', function (baseCurrencySlug, counterCurrencySlug) {
  check(baseCurrencySlug, String);
  check(counterCurrencySlug, String);

  var baseCurrency = Currencies.findOne({slug: baseCurrencySlug});
  var counterCurrency = Currencies.findOne({slug: counterCurrencySlug});

  return {
    find: function () {
      return CompanyPrices.find({baseCurrency: baseCurrency._id});
    },
    children: [
      {
        find: function (companyPrice) {
          return ExchangeRates.find({provider: companyPrice.exchangeRateProvider, baseCurrency: companyPrice.baseCurrency, counterCurrency: companyPrice.counterCurrency});
        }
      },
      {
        find: function (companyPrice) {
          return ExchangeRateProviders.find(companyPrice.exchangeRateProvider);
        }
      }
    ]
  }
});
