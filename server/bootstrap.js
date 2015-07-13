Meteor.startup(function() {
  if (Members.find().count() === 0) {
    Members.insert({
      firstName: 'Francis',
      lastName: 'Brunelle',
      phoneNumber: '579-488-0793',
      email: 'frabrunelle@gmail.com'
    });
  }

  if (Currencies.find().count() === 0) {
    var btc = Currencies.insert({
      name: 'Bitcoin',
      code: 'BTC',
      denomination: 'bitcoins',
      precision: 4
    });

    var cad = Currencies.insert({
      name: 'Canadian Dollar',
      code: 'CAD',
      denomination: 'Canadian dollars'
    });

    var usd = Currencies.insert({
      name: 'US Dollar',
      code: 'USD',
      denomination: 'US dollars'
    });

    var bitPay = ExchangeRateProviders.insert({
      name: 'BitPay',
      baseUrl: 'https://bitpay.com/api'
    });

    var coinbase = ExchangeRateProviders.insert({
      name: 'Coinbase',
      baseUrl: 'https://api.coinbase.com'
    });

    var bitPayRateCad = HTTP.get('https://bitpay.com/api/rates/cad').data['rate'];
    var bitPayRateUsd = HTTP.get('https://bitpay.com/api/rates/usd').data['rate'];

    var coinbaseRateCad = HTTP.get('https://api.coinbase.com/v1/prices/spot_rate?currency=CAD').data['amount'];
    var coinbaseRateUsd = HTTP.get('https://api.coinbase.com/v1/prices/spot_rate?currency=USD').data['amount'];

    ExchangeRates.insert({
      provider: bitPay,
      baseCurrency: btc,
      counterCurrency: cad,
      endpointUrl: '/rates/cad',
      jsonKey: 'rate',
      rate: parseFloat(accounting.toFixed(bitPayRateCad, Currencies.findOne(cad).precision))
    });

    ExchangeRates.insert({
      provider: bitPay,
      baseCurrency: btc,
      counterCurrency: usd,
      endpointUrl: '/rates/usd',
      jsonKey: 'rate',
      rate: parseFloat(accounting.toFixed(bitPayRateUsd, Currencies.findOne(usd).precision))
    });

    ExchangeRates.insert({
      provider: coinbase,
      baseCurrency: btc,
      counterCurrency: cad,
      endpointUrl: '/v1/prices/spot_rate?currency=CAD',
      jsonKey: 'amount',
      rate: coinbaseRateCad
    });

    ExchangeRates.insert({
      provider: coinbase,
      baseCurrency: btc,
      counterCurrency: usd,
      endpointUrl: '/v1/prices/spot_rate?currency=USD',
      jsonKey: 'amount',
      rate: coinbaseRateUsd
    });

    CompanyPrices.insert({
      baseCurrency: btc,
      counterCurrency: cad,
      exchangeRateProvider: coinbase,
      percentageFeeForBuyers: 6,
      percentageFeeForSellers: -3
    });

    CompanyPrices.insert({
      baseCurrency: btc,
      counterCurrency: usd,
      exchangeRateProvider: coinbase,
      percentageFeeForBuyers: 10,
      percentageFeeForSellers: -6
    });

    PaymentMethods.insert({
      name: 'Bitcoin',
      currency: btc,
      flatFeeForReceiving: 0,
      flatFeeForSending: 0
    });

    PaymentMethods.insert({
      name: 'Cash',
      currency: cad,
      flatFeeForReceiving: 5,
      flatFeeForSending: 7
    });

    PaymentMethods.insert({
      name: 'Debit card',
      currency: cad,
      flatFeeForReceiving: 6,
      canBeUsedForSending: false
    });

    PaymentMethods.insert({
      name: 'Credit card',
      currency: cad,
      flatFeeForReceiving: 6,
      percentageFeeForReceiving: 2.75,
      canBeUsedForSending: false
    });

    PaymentMethods.insert({
      name: 'Cash',
      currency: usd,
      flatFeeForReceiving: 6,
      flatFeeForSending: 8
    });
  }

  ExchangeRateProviders.find().forEach(function (provider) {
    Meteor.setInterval(function() {
      ExchangeRates.find({provider: provider._id}).forEach(function (exchangeRate) {
        HTTP.get(this + exchangeRate.endpointUrl, function (error, result) {
          if (!error) {
            var rate = result.data[exchangeRate.jsonKey];
            var counterCurrency = Currencies.findOne(exchangeRate.counterCurrency);
            ExchangeRates.update(exchangeRate._id, {$set: {rate: parseFloat(accounting.toFixed(rate, counterCurrency.precision))}});
          }
        });
      }, provider.baseUrl);
    }, provider.refreshInterval * 1000);
  });
});
