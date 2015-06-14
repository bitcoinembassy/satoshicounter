['BTC', 'USD'].forEach(function(currencyCode) {
  var interval = Meteor.setInterval(function() {
    var value = HTTP.get("https://api.coinbase.com/v1/currencies/exchange_rates").data[currencyCode.toLowerCase() + '_to_cad'];

    var fromCurrency = Currencies.findOne({code: currencyCode});
    var toCurrency = Currencies.findOne({code: 'CAD'});

    ExchangeRates.update(
      {
        fromCurrency: fromCurrency._id,
        toCurrency: toCurrency._id
      },
      {
        $set: {
          value: value
        },
      }
    );
  }, 60000);

  Meteor.setInterval(function() {
    var value = Math.ceil((interval._idleStart + interval._idleTimeout - Date.now()) / 1000);

    var fromCurrency = Currencies.findOne({code: currencyCode});
    var toCurrency = Currencies.findOne({code: 'CAD'});

    var exchangeRate = ExchangeRates.findOne({fromCurrency: fromCurrency._id, toCurrency: toCurrency._id});

    Timers.update(
      {
        exchangeRate: exchangeRate._id
      },
      {
        $set: {
          value: value
        }
      }
    );
  }, 5000);
});
