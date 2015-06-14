['CAD', 'USD'].forEach(function(currencyCode) {
  var interval = Meteor.setInterval(function() {
    var coinbaseRate = HTTP.get("https://api.coinbase.com/v1/prices/spot_rate?currency=" + currencyCode.toLowerCase()).data['amount'];
    var bitpayRate = HTTP.get("https://bitpay.com/api/rates/" + currencyCode.toLowerCase()).data['rate'];

    if (Math.abs(coinbaseRate - bitpayRate) > coinbaseRate * 0.05) {
      var value = 0.11;
    } else if (coinbaseRate > bitpayRate) {
      var value = coinbaseRate;
    } else {
      var value = bitpayRate;
    }

    var fromCurrency = Currencies.findOne({code: currencyCode});
    var toCurrency = Currencies.findOne({code: 'BTC'});

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
    var toCurrency = Currencies.findOne({code: 'BTC'});

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
