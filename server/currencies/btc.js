var btc = Meteor.setInterval(function() {
  ['cad', 'usd'].forEach(function(currency) {
    var coinbaseRate = HTTP.get("https://api.coinbase.com/v1/prices/spot_rate?currency=" + currency).data['amount'];
    var bitpayRate = HTTP.get("https://bitpay.com/api/rates/" + currency).data['rate'];

    if (Math.abs(coinbaseRate - bitpayRate) > coinbaseRate * 0.05) {
      var value = 0.11;
    } else if (coinbaseRate > bitpayRate) {
      var value = coinbaseRate;
    } else {
      var value = bitpayRate;
    }

    ExchangeRates.update(
      {
        fromCurrency: currency,
        toCurrency: 'btc'
      },
      {
        $set: {
          value: value
        },
      }
    );
  });
}, 60000);

Meteor.setInterval(function() {
  var value = Math.ceil((btc._idleStart + btc._idleTimeout - Date.now()) / 1000);
  Timers.update(
    {
      currencyCode: 'BTC'
    },
    {
      $set: {
        value: value
      }
    }
  );
}, 5000);
