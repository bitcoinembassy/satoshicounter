Meteor.startup(function() {
  if (Members.find().count() === 0) {
    setCounter('_counters', 'members', 1000);
  }

  if (Currencies.find().count() === 0) {
    var btc = Currencies.insert({
      code: 'BTC',
      name: 'Bitcoin',
      pluralName: 'bitcoins'
    });

    var cad = Currencies.insert({
      code: 'CAD',
      name: 'Canadian Dollar',
      pluralName: 'Canadian dollars'
    });

    var usd = Currencies.insert({
      code: 'USD',
      name: 'US Dollar',
      pluralName: 'US dollars'
    });

    ['cad', 'usd'].forEach(function(currencyCode) {
      var coinbaseRate = HTTP.get("https://api.coinbase.com/v1/prices/spot_rate?currency=" + currencyCode).data['amount'];
      var bitpayRate = HTTP.get("https://bitpay.com/api/rates/" + currencyCode).data['rate'];

      if (Math.abs(coinbaseRate - bitpayRate) > coinbaseRate * 0.05) {
        var value = 0.11;
      } else if (coinbaseRate > bitpayRate) {
        var value = coinbaseRate;
      } else {
        var value = bitpayRate;
      }

      var fromCurrency = Currencies.findOne({code: currencyCode});
      var toCurrency = Currencies.findOne({code: 'BTC'});

      var exchangeRate = ExchangeRates.insert({
        fromCurrency: fromCurrency._id,
        toCurrency: toCurrency._id,
        value: value,
        percentageFee: 5,
        flatFee: 5
      });

      Timers.insert({
        exchangeRate: exchangeRate._id
      });
    });

    ['btc', 'usd'].forEach(function(currencyCode) {
      var value = HTTP.get("https://api.coinbase.com/v1/currencies/exchange_rates").data['cad_to_' + currencyCode];

      var fromCurrency = Currencies.findOne({code: currencyCode});
      var toCurrency = Currencies.findOne({code: 'CAD'});

      var exchangeRate = ExchangeRates.insert({
        fromCurrency: fromCurrency._id,
        toCurrency: toCurrency._id,
        value: value,
        percentageFee: 5,
        flatFee: 5
      });

      Timers.insert({
        exchangeRate: exchangeRate._id
      });
    });

    ['btc', 'cad'].forEach(function(currencyCode) {
      var value = HTTP.get("https://api.coinbase.com/v1/currencies/exchange_rates").data['usd_to_' + currencyCode];

      var fromCurrency = Currencies.findOne({code: currencyCode});
      var toCurrency = Currencies.findOne({code: 'USD'});

      var exchangeRate = ExchangeRates.insert({
        fromCurrency: fromCurrency._id,
        toCurrency: toCurrency._id,
        value: value,
        percentageFee: 5,
        flatFee: 5
      });

      Timers.insert({
        exchangeRate: exchangeRate._id
      });
    });

    PaymentMethods.insert({
      name: 'Bitcoin address',
      currency: btc,
      percentageFee: 0,
      flatFee: 0
    });

    PaymentMethods.insert({
      name: 'Cash',
      currency: cad,
      percentageFee: 0,
      flatFee: 0
    });

    PaymentMethods.insert({
      name: 'Debit card',
      currency: cad,
      percentageFee: 0,
      flatFee: 1
    });

    PaymentMethods.insert({
      name: 'Credit card',
      currency: cad,
      percentageFee: 2.75,
      flatFee: 1
    });

    PaymentMethods.insert({
      name: 'Cash',
      currency: usd,
      percentageFee: 2,
      flatFee: 1
    });
  }
});
