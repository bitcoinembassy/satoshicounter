Template.currencyConverter.onCreated(function() {
  console.log(Router.current().params.fromCurrency)
  console.log(Router.current().params.toCurrency)
  var self = this;
  self.autorun(function() {
    self.subscribe('exchangeRate', Router.current().params.fromCurrency, Router.current().params.toCurrency);
  });

  // var currency = this.subscribe('currencies');
  //
  // this.autorun(function() {
  //   if (currency.ready()) {
  //     var btc = Currencies.findOne({code: 'BTC'});
  //
  //     var marketPrice = btc.exchangeRates[0].value;
  //     Session.set('buy.marketPrice', marketPrice);
  //
  //     var companyPrice = marketPrice * (1 + btc.exchangeRates[0].percentageFee / 100);
  //     Session.set('buy.companyPrice', companyPrice);
  //
  //     Session.set('buy.flatFee', btc.exchangeRates[0].flatFee);
  //   }
  // });

  // Session.setDefault('buy.btc.paymentMethod', 'Cash');

  // var paymentMethods = this.subscribe('paymentMethods');
  //
  // this.autorun(function() {
  //   if (paymentMethods.ready()) {
  //     var paymentMethod = PaymentMethods.findOne({name: Session.get('buy.btc.paymentMethod')});
  //     var percentageFee = Session.get('buy.fromAmount') * (paymentMethod.percentageFee / 100);
  //     Session.set('buy.paymentMethodFee', percentageFee + paymentMethod.flatFee);
  //   }
  // });

  var timers = this.subscribe('timers');

  this.autorun(function() {
    if (timers.ready()) {
      var cad = Timers.findOne({currencyCode: 'CAD'});
      Session.set('buy.timeLeft', cad.value);
    }
  });
});

Template.currencyConverter.helpers({
  companyPrice: function() {
    // return Session.get('buy.companyPrice');
    return 303.05;
  },
  percentageLeft: function() {
    return Session.get('buy.timeLeft') / 0.6;
  },
  fromAmount: function() {
    return Session.get('buy.fromAmount');
  },
  fromCurrency: function() {
    return 'CAD';
  },
  toAmount: function() {
    return Session.get('buy.toAmount');
  },
  toCurrency: function() {
    return 'BTC'
  },
  flatFee: function() {
    return Session.get('buy.flatFee');
  },
  paymentMethod: function() {
    return Session.get('buy.btc.paymentMethod');
  },
  paymentMethodFee: function() {
    return Session.get('buy.paymentMethodFee');
  },
  tax: function() {
    var fees = Session.get('buy.flatFee') + Session.get('buy.paymentMethodFee');
    return fees * 0.05 + fees * 0.09975;
  },
  fromAmountAfterFees: function() {
    var fees = Session.get('buy.flatFee') + Session.get('buy.paymentMethodFee');
    var tax = fees * 0.05 + fees * 0.09975;
    return Session.get('buy.fromAmount') - fees - tax;
  },
  marketValue: function() {
    if (Session.get('buy.toAmount')) {
      return accounting.toFixed(Session.get('buy.toAmount') * Session.get('buy.marketPrice'), 2);
    }
  },
  marketValueCurrency: function() {
    return 'CAD';
  }
});

Template.currencyConverter.events({
  "input [name=fromAmount]": function(event) {
    var fromAmount = event.target.value;
    if ($.isNumeric(fromAmount)) {
      Session.set('buy.fromAmount', fromAmount);
      var fees = Session.get('buy.flatFee') + Session.get('buy.paymentMethodFee');
      var tax = fees * 0.05 + fees * 0.09975;
      if (fromAmount > fees + tax) {
        var toAmount = (fromAmount - fees - tax) / Session.get('buy.companyPrice');
        Session.set('buy.toAmount', accounting.toFixed(toAmount, 4));
      } else {
        Session.set('buy.toAmount', 0);
      }
    } else {
      Session.set('buy.fromAmount', NaN);
      Session.set('buy.toAmount', NaN);
    }
  },
  "input [name=toAmount]": function(event) {
    var toAmount = event.target.value;
    if ($.isNumeric(toAmount)) {
      Session.set('buy.toAmount', toAmount);
      var fees = Session.get('buy.flatFee') + Session.get('buy.paymentMethodFee');
      var tax = fees * 0.05 + fees * 0.09975;
      var fromAmount = toAmount * Session.get('buy.companyPrice') + fees + tax;
      if (fromAmount > fees + tax) {
        Session.set('buy.fromAmount', accounting.toFixed(fromAmount, 2));
      } else {
        Session.set('buy.fromAmount', 0);
      }
    } else {
      Session.set('buy.toAmount', NaN);
      Session.set('buy.fromAmount', NaN);
    }
  },
  'change [value="Cash"]': function(event) {
    Session.set('buy.btc.paymentMethod', 'Cash');

    var cash = PaymentMethods.findOne({name: 'Cash', currencyCode: 'CAD'});
    var percentageFee = Session.get('buy.fromAmount') * (cash.percentageFee / 100);
    var fees = Session.get('buy.flatFee') + percentageFee + cash.flatFee;

    var tax = fees * 0.05 + fees * 0.09975;

    var fromAmountAfterFees = Session.get('buy.fromAmount') - fees - tax;

    var toAmount = fromAmountAfterFees / Session.get('buy.companyPrice');
    Session.set('buy.toAmount', accounting.toFixed(toAmount, 4));
  },
  'change [value="Debit card"]': function(event) {
    Session.set('buy.btc.paymentMethod', 'Debit card');

    var debitCard = PaymentMethods.findOne({name: 'Debit card', currencyCode: 'CAD'});
    var percentageFee = Session.get('buy.fromAmount') * (debitCard.percentageFee / 100);
    var fees = Session.get('buy.flatFee') + percentageFee + debitCard.flatFee;

    var tax = fees * 0.05 + fees * 0.09975;

    var fromAmountAfterFees = Session.get('buy.fromAmount') - fees - tax;

    var toAmount = fromAmountAfterFees / Session.get('buy.companyPrice');
    Session.set('buy.toAmount', accounting.toFixed(toAmount, 4));
  },
  'change [value="Credit card"]': function(event) {
    Session.set('buy.btc.paymentMethod', 'Credit card');

    var creditCard = PaymentMethods.findOne({name: 'Credit card', currencyCode: 'CAD'});
    var percentageFee = Session.get('buy.fromAmount') * (creditCard.percentageFee / 100);
    var fees = Session.get('buy.flatFee') + percentageFee + creditCard.flatFee;

    var tax = fees * 0.05 + fees * 0.09975;

    var fromAmountAfterFees = Session.get('buy.fromAmount') - fees - tax;

    var toAmount = fromAmountAfterFees / Session.get('buy.companyPrice');
    Session.set('buy.toAmount', accounting.toFixed(toAmount, 4));
  },
  "click input": function(event) {
    $(event.target).select();
  },
  "submit .new-trade": function(event) {
    event.preventDefault();
    Trades.insert({
      member: 1001,
      fromAmount: Session.get('buy.fromAmount'),
      fromCurrency: 'CAD',
      toCurrency: 'BTC',
      paymentMethod: Session.get('buy.btc.paymentMethod'),
      dollarAmount: Session.get('buy.dollarAmount')
    });
    Router.go('/');
  }
});

AutoForm.hooks({
  insertTradeForm: {
    onSuccess: function() {
      Router.go('/');
    }
  }
});
