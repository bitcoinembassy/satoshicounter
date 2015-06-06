Template.buyBitcoins.onCreated(function() {
  var currency = this.subscribe('BTC');

  this.autorun(function() {
    if (currency.ready()) {
      var btc = Currencies.findOne({code: 'BTC'});

      var marketPrice = btc.exchangeRates[0].value;
      Session.set('buy.marketPrice', marketPrice);

      var companyPrice = marketPrice * (1 + btc.exchangeRates[0].percentageFee / 100);
      Session.set('buy.companyPrice', companyPrice);

      Session.set('buy.flatFee', btc.exchangeRates[0].flatFee);
    }
  });

  var paymentMethods = this.subscribe('paymentMethods');

  Session.setDefault('buy.btc.paymentMethod', 'Cash');

  var timers = this.subscribe('timers');

  this.autorun(function() {
    if (timers.ready()) {
      var cad = Timers.findOne({currencyCode: 'CAD'});
      Session.set('buy.timeLeft', cad.value);
    }
  });
});

Template.buyBitcoins.helpers({
  companyPrice: function() {
    return Session.get('buy.companyPrice');
  },
  percentageLeft: function() {
    return Session.get('buy.timeLeft') / 0.6;
  },
  dollarAmount: function() {
    return Session.get('buy.dollarAmount');
  },
  bitcoinAmount: function() {
    return Session.get('buy.bitcoinAmount');
  },
  cash: function() {
    if (Session.equals('buy.btc.paymentMethod', 'Cash')) {
      return 'checked';
    }
  },
  debitCard: function() {
    if (Session.equals('buy.btc.paymentMethod', 'Debit card')) {
      return 'checked';
    }
  },
  creditCard: function() {
    if (Session.equals('buy.btc.paymentMethod', 'Credit card')) {
      return 'checked';
    }
  },
  flatFee: function() {
    return Session.get('buy.flatFee');
  },
  paymentMethod: function() {
    return Session.get('buy.btc.paymentMethod').toLowerCase();
  },
  paymentMethodFee: function() {
    var paymentMethod = PaymentMethods.findOne({name: Session.get('buy.btc.paymentMethod')});
    if (paymentMethod) {
      var percentageFee = Session.get('buy.dollarAmount') * (paymentMethod.percentageFee / 100);
      var paymentMethodFee = percentageFee + paymentMethod.flatFee;
      return paymentMethodFee;
    }
  },
  tax: function() {
    return Session.get('buy.flatFee') * 0.05 + Session.get('buy.flatFee') * 0.09975;
  },
  finalAmountDollars: function() {
    var flatFee = Session.get('buy.flatFee');
    var tax = flatFee * 0.05 + flatFee * 0.09975;
    return Session.get('buy.dollarAmount') - flatFee - tax;
  },
  marketValue: function() {
    return Session.get('buy.bitcoinAmount') * Session.get('buy.marketPrice');
  }
});

Template.buyBitcoins.events({
  "input #dollarAmount": function(event) {
    var dollarAmount = event.target.value;
    if ($.isNumeric(dollarAmount)) {
      Session.set('buy.dollarAmount', dollarAmount);
      var flatFee = Session.get('buy.flatFee');
      var tax = flatFee * 0.05 + flatFee * 0.09975;
      if (dollarAmount > flatFee + tax) {
        var bitcoinAmount = (dollarAmount - flatFee - tax) / Session.get('buy.companyPrice');
        Session.set('buy.bitcoinAmount', accounting.toFixed(bitcoinAmount, 4));
      } else {
        Session.set('buy.bitcoinAmount', 0);
      }
    } else {
      Session.set('buy.dollarAmount', NaN);
      Session.set('buy.bitcoinAmount', NaN);
    }
  },
  "input #bitcoinAmount": function(event) {
    var bitcoinAmount = event.target.value;
    if ($.isNumeric(bitcoinAmount)) {
      Session.set("buy.bitcoinAmount", bitcoinAmount);
      var flatFee = Session.get('buy.flatFee');
      var tax = flatFee * 0.05 + flatFee * 0.09975;
      var dollarAmount = bitcoinAmount * Session.get('buy.companyPrice') + flatFee + tax;
      if (dollarAmount > flatFee + tax) {
        Session.set("buy.dollarAmount", accounting.toFixed(dollarAmount, 2));
      } else {
        Session.set("buy.dollarAmount", 0);
      }
    } else {
      Session.set("buy.bitcoinAmount", NaN);
      Session.set("buy.dollarAmount", NaN);
    }
  },
  "click #cash": function(event) {
    Session.set('buy.btc.paymentMethod', 'Cash');

    var cash = PaymentMethods.findOne({name: 'Cash', currencyCode: 'CAD'});
    var flatFee = cash.flatFee;

    var tax = flatFee * 0.05 + flatFee * 0.09975;
    var finalAmountDollars = Session.get('dollarAmount') - flatFee - tax;
    var bitcoinAmount = finalAmountDollars / Session.get('buy.companyPrice');
    Session.set('bitcoinAmount', accounting.toFixed(bitcoinAmount, 4));
  },
  "click #debitCard": function(event) {
    Session.set('buy.btc.paymentMethod', 'Debit card');

    var debitCard = PaymentMethods.findOne({name: 'Debit card', currencyCode: 'CAD'});
    var flatFee = debitCard.flatFee;

    var tax = flatFee * 0.05 + flatFee * 0.09975;
    var finalAmountDollars = Session.get('dollarAmount') - flatFee - tax;
    var bitcoinAmount = finalAmountDollars / Session.get('buy.companyPrice');
    Session.set('bitcoinAmount', accounting.toFixed(bitcoinAmount, 4));
  },
  "click #creditCard": function(event) {
    Session.set('buy.btc.paymentMethod', 'Credit card');

    var creditCard = PaymentMethods.findOne({name: 'Credit card', currencyCode: 'CAD'});
    var flatFee = creditCard.flatFee;

    var tax = flatFee * 0.05 + flatFee * 0.09975;
    var finalAmountDollars = Session.get('dollarAmount') - flatFee - tax;
    var bitcoinAmount = finalAmountDollars / Session.get('buy.companyPrice');
    Session.set('bitcoinAmount', accounting.toFixed(bitcoinAmount, 4));
  },
  "click input": function(event) {
    $(event.target).select();
  },
  "submit .new-trade": function(event) {
    event.preventDefault();
    Trades.insert({
      member: 1001,
      type: 'buy',
      paymentMethod: Session.get('buy.btc.paymentMethod'),
      dollarAmount: Session.get('dollarAmount')
    });
    Router.go('/');
  }
});
