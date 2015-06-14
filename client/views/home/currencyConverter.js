Template.currencyConverter.onCreated(function() {
  var self = this;

  var currencies = self.subscribe('currencies');

  Session.set('fromCurrency', Router.current().params.fromCurrency.toUpperCase());
  Session.set('toCurrency', Router.current().params.toCurrency.toUpperCase());

  self.autorun(function() {
    if (currencies.ready()) {
      var fromCurrency = Currencies.findOne({code: Session.get('fromCurrency')});
      var toCurrency = Currencies.findOne({code: Session.get('toCurrency')});

      if (fromCurrency && toCurrency) {
        Session.setDefault('memberPaymentMethod', fromCurrency.mainPaymentMethod);
        Session.setDefault('companyPaymentMethod', toCurrency.mainPaymentMethod);

        var currentExchangeRate = self.subscribe('exchangeRate', fromCurrency._id, toCurrency._id);

        if (currentExchangeRate.ready()) {
          var exchangeRate = ExchangeRates.findOne({fromCurrency: fromCurrency._id, toCurrency: toCurrency._id});

          if (exchangeRate) {
            Session.set('exchangeRateId', exchangeRate._id);

            var companyPrice = exchangeRate.value * (1 + exchangeRate.percentageFee / 100);
            Session.set('companyPrice', Math.round(companyPrice * 100) / 100);

            var mainCurrency = Currencies.findOne(exchangeRate.mainCurrency);
            Session.set('mainCurrency', mainCurrency.code);

            Session.set('flatFee', exchangeRate.flatFee);

            var tax = exchangeRate.flatFee * 0.05 + exchangeRate.flatFee * 0.09975;
            Session.set('tax', Math.round(tax * 100) / 100);
          }
        }
      }
    }
  });

  var timers = self.subscribe('timers');

  this.autorun(function() {
    if (timers.ready()) {
      var exchangeRateId = Session.get('exchangeRateId');
      if (exchangeRateId) {
        var timer = Timers.findOne({exchangeRate: exchangeRateId});
        Session.set('timerValue', timer.value);
      }
    }
  });

  var paymentMethods = this.subscribe('paymentMethods');
  //
  // this.autorun(function() {
  //   if (paymentMethods.ready()) {
  //     var fromCurrency = Currencies.findOne({code: Session.get('fromCurrency')});
  //
  //     var paymentMethod = PaymentMethods.findOne({currency: Session.get('buy.btc.paymentMethod')});
  //     var percentageFee = Session.get('buy.fromAmount') * (paymentMethod.percentageFee / 100);
  //     Session.set('buy.paymentMethodFee', percentageFee + paymentMethod.flatFee);
  //   }
  // });
});

Template.currencyConverter.onRendered(function() {
  var paymentMethods = this.subscribe('paymentMethods');

  this.autorun(function() {
    var memberPaymentMethod = AutoForm.getFieldValue('memberPaymentMethod', 'insertTradeForm');
    if (memberPaymentMethod) {
      if (paymentMethods.ready()) {
        var paymentMethod = PaymentMethods.findOne(memberPaymentMethod);
        Session.set('memberPaymentMethod', paymentMethod.name);

        var fromAmount = Session.get('fromAmount');
        if (fromAmount) {
          var paymentMethodFee = fromAmount * (paymentMethod.percentageFee / 100) + paymentMethod.flatFee;
          console.log(paymentMethodFee)
          Session.set('memberPaymentMethodFee', paymentMethodFee);
        }
      }
    }
  });

  this.autorun(function() {
    var member = AutoForm.getFieldValue('member', 'insertTradeForm');
    Session.set('member', member);
  });
});

Template.currencyConverter.helpers({
  companyPrice: function() {
    return Session.get('companyPrice');
  },
  mainCurrency: function() {
    return Session.get('mainCurrency');
  },
  percentageLeft: function() {
    return 100 - (Session.get('timerValue') / 0.6);
  },
  fromAmount: function() {
    return Session.get('fromAmount');
  },
  fromCurrency: function() {
    return Session.get('fromCurrency');
  },
  memberPaymentMethod: function() {
    return Session.get('memberPaymentMethod');
  },
  toAmount: function() {
    return Session.get('toAmount');
  },
  toCurrency: function() {
    return Session.get('toCurrency');
  },
  companyPaymentMethod: function() {
    return Session.get('companyPaymentMethod');
  },
  flatFee: function() {
    return Session.get('flatFee');
  },
  memberPaymentMethodFee: function() {
    return Session.get('memberPaymentMethodFee');
  },
  companyPaymentMethodFee: function() {
    return Session.get('companyPaymentMethodFee');
  },
  tax: function() {
    return Session.get('tax');
  },
  totalFees: function() {
    return Session.get('flatFee') + Session.get('tax');
  },
  amountMinusFees: function() {
    return Session.get('fromAmount') - Session.get('flatFee') - Session.get('tax');
  },
  marketValue: function() {
    if (Session.get('toAmount')) {
      return accounting.toFixed(Session.get('toAmount') * Session.get('marketPrice'), 2);
    }
  },
  marketValueCurrency: function() {
    return 'CAD';
  },
  member: function() {
    return Session.get('member');
  }
});

Template.currencyConverter.events({
  "input [name=fromAmount]": function(event) {
    var fromAmount = parseFloat(event.target.value);
    if (isNaN(fromAmount)) {
      Session.set('fromAmount', NaN);
      Session.set('toAmount', NaN);
    } else {
      Session.set('fromAmount', fromAmount);
      var totalFees = Session.get('flatFee') + Session.get('tax');
      // var fees = Session.get('flatFee') + Session.get('memberPaymentMethodFee') + Session.get('companyPaymentMethodFee');
      if (fromAmount > totalFees) {
        var toAmount = (fromAmount - totalFees) / Session.get('companyPrice');
        Session.set('toAmount', accounting.toFixed(toAmount, 4));
      } else {
        Session.set('toAmount', 0);
      }
    }
  },
  "input [name=toAmount]": function(event) {
    var toAmount = parseFloat(event.target.value);
    if (isNaN(toAmount)) {
      Session.set('buy.toAmount', NaN);
      Session.set('buy.fromAmount', NaN);
    } else {
      Session.set('toAmount', toAmount);
      var totalFees = Session.get('flatFee') + Session.get('tax');
      var fromAmount = toAmount * Session.get('companyPrice') + totalFees;
      if (fromAmount > totalFees) {
        Session.set('fromAmount', accounting.toFixed(fromAmount, 2));
      } else {
        Session.set('fromAmount', 0);
      }
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
