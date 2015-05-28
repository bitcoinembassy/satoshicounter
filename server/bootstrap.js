Meteor.startup(function() {
  if (Members.find().count() === 0) {
    setCounter('_counters', 'members', 1000);
  }

  if (PaymentMethods.find().count() === 0) {
    PaymentMethods.insert({
      name: 'Cash',
      buyPrice: {
        percentageFee: 7,
        flatFee: 5
      },
      sellPrice: {
        percentageFee: 4,
        flatFee: 5
      }
    });

    PaymentMethods.insert({
      name: 'Debit',
      buyPrice: {
        percentageFee: 1,
        flatFee: 1
      },
      sellPrice: {
        percentageFee: 1,
        flatFee: 1
      }
    });

    PaymentMethods.insert({
      name: 'Credit',
      buyPrice: {
        percentageFee: 2.75,
        flatFee: 2
      },
      sellPrice: {
        percentageFee: 2.75,
        flatFee: 2
      }
    });
  }

  if (Currencies.find({name: 'Canadian dollar', code: 'CAD'}).count() === 0) {
    var coinbasePrice = HTTP.get("https://api.coinbase.com/v1/prices/spot_rate?currency=CAD").data['amount'];
    var bitpayPrice = HTTP.get("https://bitpay.com/api/rates/cad").data['rate'];

    if (Math.abs(coinbasePrice - bitpayPrice) > coinbasePrice * 0.05) {
      var askPrice = 0.11;
      var bidPrice = 999.99;
    } else if (coinbasePrice > bitpayPrice) {
      var askPrice = coinbasePrice;
      var bidPrice = bitpayPrice;
    } else {
      var askPrice = bitpayPrice;
      var bidPrice = coinbasePrice;
    }

    var cash = PaymentMethods.findOne({name: 'Cash'});

    var buyPrice = askPrice * (1 + cash.buyPrice.percentageFee / 100);
    var sellPrice = bidPrice * (1 - cash.sellPrice.percentageFee / 100);

    Currencies.insert({
      name: 'Canadian dollar',
      code: 'CAD',
      askPrice: askPrice,
      bidPrice: bidPrice,
      buyPrice: buyPrice,
      sellPrice: sellPrice
    });
  }

  if (Currencies.find({name: 'United States dollar', code: 'USD'}).count() === 0) {
    var coinbasePrice = HTTP.get("https://api.coinbase.com/v1/prices/spot_rate").data['amount'];
    var bitpayPrice = HTTP.get("https://bitpay.com/api/rates/usd").data['rate'];

    if (Math.abs(coinbasePrice - bitpayPrice) > coinbasePrice * 0.05) {
      var askPrice = 0.11;
      var bidPrice = 999.99;
    } else if (coinbasePrice > bitpayPrice) {
      var askPrice = coinbasePrice;
      var bidPrice = bitpayPrice;
    } else {
      var askPrice = bitpayPrice;
      var bidPrice = coinbasePrice;
    }

    var cash = PaymentMethods.findOne({name: 'Cash'});

    var buyPrice = askPrice * (1 + cash.buyPrice.percentageFee / 100);
    var sellPrice = bidPrice * (1 - cash.sellPrice.percentageFee / 100);

    Currencies.insert({
      name: 'United States dollar',
      code: 'USD',
      askPrice: askPrice,
      bidPrice: bidPrice,
      buyPrice: buyPrice,
      sellPrice: sellPrice
    });
  }
});
