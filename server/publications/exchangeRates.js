Meteor.publish('exchangeRate', function(memberCurrency, companyCurrency) {
  check(memberCurrency, String);
  check(companyCurrency, String);
  var memberCurrency = Currencies.findOne({code: memberCurrency.toUpperCase()});
  var companyCurrency = Currencies.findOne({code: companyCurrency.toUpperCase()});
  if (memberCurrency && companyCurrency) {
    return ExchangeRates.find({fromCurrency: memberCurrency._id, toCurrency: companyCurrency._id});
  }
});
