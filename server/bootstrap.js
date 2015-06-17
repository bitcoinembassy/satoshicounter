Meteor.startup(function() {
  if (Members.find().count() === 0) {
    setCounter('_counters', 'members', 1000);

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
      precision: 4
    });

    var cad = Currencies.insert({
      name: 'Canadian Dollar',
      code: 'CAD'
    });

    var usd = Currencies.insert({
      name: 'US Dollar',
      code: 'USD'
    });

    var bitPay = ExchangeRateProviders.insert({
      name: 'BitPay',
      baseUrl: 'https://bitpay.com/api'
    });

    var coinbase = ExchangeRateProviders.insert({
      name: 'Coinbase',
      baseUrl: 'https://api.coinbase.com'
    });

    Timers.insert({
      exchangeRateProvider: bitPay
    });

    Timers.insert({
      exchangeRateProvider: coinbase
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
      rate: bitPayRateCad
    });

    ExchangeRates.insert({
      provider: bitPay,
      baseCurrency: btc,
      counterCurrency: usd,
      endpointUrl: '/rates/cad',
      jsonKey: 'rate',
      rate: bitPayRateUsd
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
      percentageFeeForBuyers: 5,
      percentageFeeForSellers: -5,
      flatFee: 5
    });

    CompanyPrices.insert({
      baseCurrency: btc,
      counterCurrency: usd,
      exchangeRateProvider: coinbase,
      percentageFeeForBuyers: 7,
      percentageFeeForSellers: -7,
      flatFee: 6
    });

    PaymentMethods.insert({
      name: 'Bitcoin',
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
      flatFee: 1,
      canBeUsedForSending: false
    });

    PaymentMethods.insert({
      name: 'Credit card',
      currency: cad,
      percentageFee: 2.75,
      flatFee: 1,
      canBeUsedForSending: false
    });

    PaymentMethods.insert({
      name: 'Cash',
      currency: usd,
      percentageFee: 2,
      flatFee: 1
    });
  }
});
