var usd = Meteor.setInterval(function() {
  ['BTC', 'CAD'].forEach(function(currency) {
    var coinbaseRate = HTTP.get("https://api.coinbase.com/v1/currencies/exchange_rates").data['usd_to_' + currency.toLowerCase()];

    Currencies.update(
      {
        code: 'USD',
        exchangeRates: {
          currencyCode: currency
        }
      },
      {
        $set: {
          'exchangeRates.$': {
            currencyCode: currency,
            value: coinbaseRate
          }
        },
      }
    );
  });
}, 60000);

Meteor.setInterval(function() {
  var value = Math.ceil((usd._idleStart + usd._idleTimeout - Date.now()) / 1000);
  Timers.update(
    {
      currencyCode: 'USD'
    },
    {
      $set: {
        value: value
      }
    }
  );
}, 5000);
