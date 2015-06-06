var cad = Meteor.setInterval(function() {
  ['BTC', 'USD'].forEach(function(currency) {
    var coinbaseRate = HTTP.get("https://api.coinbase.com/v1/currencies/exchange_rates").data['cad_to_' + currency.toLowerCase()];

    Currencies.update(
      {
        code: 'CAD',
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
  var value = Math.ceil((cad._idleStart + cad._idleTimeout - Date.now()) / 1000);
  Timers.update(
    {
      currencyCode: 'CAD'
    },
    {
      $set: {
        value: value
      }
    }
  );
}, 5000);
