var cad = Meteor.setInterval(function() {
  ['BTC', 'USD'].forEach(function(currency) {
    var value = HTTP.get("https://api.coinbase.com/v1/currencies/exchange_rates").data['cad_to_' + currency.toLowerCase()];

    ExchangeRates.update(
      {
        fromCurrency: currency,
        toCurrency: 'CAD'
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
