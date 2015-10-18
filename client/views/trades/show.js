Template.tradesShow.onCreated(function () {
  var tradeId = Router.current().params._id;
  var tradeSubscription = this.subscribe('trade', tradeId);

  this.autorun(function () {
    if (tradeSubscription.ready()) {
      var trade = Trades.findOne(tradeId);
      Session.set('tradeId', trade._id);
      Session.set('member', trade.member);
      Session.set('priceType', trade.priceType);

      var baseCurrency = Currencies.findOne(trade.baseCurrency);
      Session.set('baseCurrency.code', baseCurrency.code);
      Session.set('baseCurrency.precision', baseCurrency.precision);

      var counterCurrency = Currencies.findOne(trade.counterCurrency);
      Session.set('counterCurrency.code', counterCurrency.code);
      Session.set('counterCurrency.precision', counterCurrency.precision);

      var paymentMethod = PaymentMethods.findOne(trade.paymentMethodForAmountReceived);
      Session.set('paymentMethodForAmountReceived.name', paymentMethod.name.toLowerCase());

      Session.set('amountSent', trade.amountSent.toString());
      Session.set('bitcoinAddressForAmountSent', trade.bitcoinAddressForAmountSent);
    }
  });
});

Template.tradesShow.helpers({
  member: function () {
    return Members.findOne(Session.get('member'));
  },
  trade: function () {
    return Trades.findOne(Router.current().params._id);
  },
  buyPrice: function () {
    if (Session.equals('priceType', 'buy')) {
      return true;
    }
  },
  paymentMethodNameForAmountReceived: function () {
    return Session.get('paymentMethodForAmountReceived.name');
  },
  bitcoinAddressForAmountSent: function () {
    return Session.get('bitcoinAddressForAmountSent');
  },
  bitcoinURI: function () {
    return "bitcoin:" + Session.get('bitcoinAddressForAmountSent') + "?amount=" + Session.get('amountSent') + "&label=" + Session.get('tradeId');
  }
});

qrScanner.on('scan', function(err, message) {
  if (message != null) {
    $('#scanAddress').modal('hide')
    $('input[name=bitcoinAddressForAmountSent]').val(message);
  }
});
