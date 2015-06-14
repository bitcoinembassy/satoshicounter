Meteor.publish('exchangeRate', function(fromCurrencyId, toCurrencyId) {
  check(fromCurrencyId, String);
  check(toCurrencyId, String);
  return ExchangeRates.find({fromCurrency: fromCurrencyId, toCurrency: toCurrencyId});
});
