Meteor.startup(function() {
  if (Members.find().count() === 0) {
    setCounter('_counters', 'members', 2000);

    Members.insert({
      firstName: 'Francis',
      lastName: 'Brunelle',
      phoneNumber: '579-488-0793'
    });
  }

  if (Currencies.find().count() === 0) {
    var btc = Currencies.insert({
      name: 'Bitcoin',
      code: 'BTC',
      precision: 4,
      pluralName: 'bitcoins'
    });

    var cad = Currencies.insert({
      name: 'Canadian Dollar',
      code: 'CAD',
      pluralName: 'Canadian dollars'
    });

    var usd = Currencies.insert({
      name: 'US Dollar',
      code: 'USD',
      pluralName: 'US dollars'
    });

    ['CAD', 'USD'].forEach(function(currencyCode) {
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

      var exchangeRate = ExchangeRates.insert({
        fromCurrency: fromCurrency._id,
        toCurrency: toCurrency._id,
        value: value,
        percentageFee: 5,
        flatFee: 5,
        mainCurrency: fromCurrency._id
      });

      Timers.insert({
        exchangeRate: exchangeRate
      });
    });

    ['BTC', 'USD'].forEach(function(currencyCode) {
      var value = HTTP.get("https://api.coinbase.com/v1/currencies/exchange_rates").data[currencyCode.toLowerCase() + '_to_cad'];

      var fromCurrency = Currencies.findOne({code: currencyCode});
      var toCurrency = Currencies.findOne({code: 'CAD'});

      var exchangeRate = ExchangeRates.insert({
        fromCurrency: fromCurrency._id,
        toCurrency: toCurrency._id,
        value: value,
        percentageFee: -5,
        flatFee: 5,
        mainCurrency: toCurrency._id
      });

      Timers.insert({
        exchangeRate: exchangeRate
      });
    });

    ['BTC', 'CAD'].forEach(function(currencyCode) {
      var value = HTTP.get("https://api.coinbase.com/v1/currencies/exchange_rates").data[currencyCode.toLowerCase() + '_to_usd'];

      var fromCurrency = Currencies.findOne({code: currencyCode});
      var toCurrency = Currencies.findOne({code: 'USD'});

      var exchangeRate = ExchangeRates.insert({
        fromCurrency: fromCurrency._id,
        toCurrency: toCurrency._id,
        value: value,
        percentageFee: -5,
        flatFee: 5,
        mainCurrency: toCurrency._id
      });

      Timers.insert({
        exchangeRate: exchangeRate
      });
    });

    var bitcoin = PaymentMethods.insert({
      name: 'Bitcoin',
      currency: btc,
      percentageFee: 0,
      flatFee: 0
    });

    Currencies.update(btc, {$set: {mainPaymentMethod: bitcoin}});

    var cash = PaymentMethods.insert({
      name: 'Cash',
      currency: cad,
      percentageFee: 0,
      flatFee: 0
    });

    Currencies.update(cad, {$set: {mainPaymentMethod: cash}});

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

    // PaymentMethods.insert({
    //   name: 'Cash (USD)',
    //   currency: usd,
    //   percentageFee: 2,
    //   flatFee: 1
    // });
  }
});
