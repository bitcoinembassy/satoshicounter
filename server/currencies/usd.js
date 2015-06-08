var usd = Meteor.setInterval(function() {
  ['BTC', 'CAD'].forEach(function(currency) {
    var value = HTTP.get("https://api.coinbase.com/v1/currencies/exchange_rates").data['usd_to_' + currency.toLowerCase()];

    ExchangeRates.update(
      {
        fromCurrency: currency,
        toCurrency: 'USD'
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
