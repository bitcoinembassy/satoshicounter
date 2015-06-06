Meteor.startup(function() {
  if (Members.find().count() === 0) {
    setCounter('_counters', 'members', 1000);
  }

  if (PaymentMethods.find().count() === 0) {
    PaymentMethods.insert({
      name: 'Bitcoin address',
      currencyCode: 'BTC',
      percentageFee: 0,
      flatFee: 0
    });

    PaymentMethods.insert({
      name: 'Cash',
      currencyCode: 'CAD',
      percentageFee: 0,
      flatFee: 0
    });

    PaymentMethods.insert({
      name: 'Debit card',
      currencyCode: 'CAD',
      percentageFee: 0,
      flatFee: 1
    });

    PaymentMethods.insert({
      name: 'Credit card',
      currencyCode: 'CAD',
      percentageFee: 2.75,
      flatFee: 1
    });

    PaymentMethods.insert({
      name: 'Cash',
      currencyCode: 'USD',
      percentageFee: 2,
      flatFee: 1
    });
  }

  if (Currencies.find({code: 'BTC'}).count() === 0) {
    var exchangeRates = ['CAD', 'USD'].map(function(currencyCode) {
      var coinbaseRate = HTTP.get("https://api.coinbase.com/v1/prices/spot_rate?currency=" + currencyCode).data['amount'];
      var bitpayRate = HTTP.get("https://bitpay.com/api/rates/" + currencyCode).data['rate'];

      if (Math.abs(coinbaseRate - bitpayRate) > coinbaseRate * 0.05) {
        var value = 0.11;
      } else if (coinbaseRate > bitpayRate) {
        var value = coinbaseRate;
      } else {
        var value = bitpayRate;
      }

      var exchangeRate = {
        currencyCode: currencyCode,
        value: value,
        percentageFee: 5,
        flatFee: 5
      }

      return exchangeRate;
    });

    Currencies.insert({
      name: 'Bitcoin',
      code: 'BTC',
      exchangeRates: exchangeRates
    });

    Timers.insert({
      currencyCode: 'BTC'
    });
  }

  if (Currencies.find({code: 'CAD'}).count() === 0) {
    var exchangeRates = ['BTC', 'USD'].map(function(currencyCode) {
      var value = HTTP.get("https://api.coinbase.com/v1/currencies/exchange_rates").data['cad_to_' + currencyCode.toLowerCase()];

      var exchangeRate = {
        currencyCode: currencyCode,
        value: value,
        percentageFee: 5,
        flatFee: 5
      }

      return exchangeRate;
    });

    Currencies.insert({
      name: 'Canadian dollar',
      code: 'CAD',
      exchangeRates: exchangeRates
    });

    Timers.insert({
      currencyCode: 'CAD'
    });
  }

  if (Currencies.find({code: 'USD'}).count() === 0) {
    var exchangeRates = ['BTC', 'CAD'].map(function(currencyCode) {
      var value = HTTP.get("https://api.coinbase.com/v1/currencies/exchange_rates").data['usd_to_' + currencyCode.toLowerCase()];

      var exchangeRate = {
        currencyCode: currencyCode,
        value: value,
        percentageFee: 5,
        flatFee: 5
      }

      return exchangeRate;
    });

    Currencies.insert({
      name: 'US dollar',
      code: 'USD',
      exchangeRates: exchangeRates
    });

    Timers.insert({
      currencyCode: 'USD'
    });
  }
});
