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
            Session.set('marketPrice', exchangeRate.value);

            var companyPrice = exchangeRate.value * (1 + exchangeRate.percentageFee / 100);
            Session.set('companyPrice', Math.round(companyPrice * 100) / 100);

            var mainCurrency = Currencies.findOne(exchangeRate.mainCurrency);
            Session.set('mainCurrency', mainCurrency.code);

            Session.set('flatFee', exchangeRate.flatFee);

            var salesTax = exchangeRate.flatFee * 0.05 + exchangeRate.flatFee * 0.09975;
            Session.set('salesTax', Math.round(salesTax * 100) / 100);

            var totalFees = exchangeRate.flatFee + salesTax;
            Session.set('totalFees', totalFees);
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
  //     var percentageFee = Session.get('buy.memberAmount') * (paymentMethod.percentageFee / 100);
  //     Session.set('buy.paymentMethodFee', percentageFee + paymentMethod.flatFee);
  //   }
  // });
});

// Template.currencyConverter.onRendered(function() {
//   var paymentMethods = this.subscribe('paymentMethods');
//
//   this.autorun(function() {
//     var memberPaymentMethod = AutoForm.getFieldValue('memberPaymentMethod', 'insertTradeForm');
//     if (memberPaymentMethod) {
//       if (paymentMethods.ready()) {
//         var paymentMethod = PaymentMethods.findOne(memberPaymentMethod);
//         Session.set('memberPaymentMethod', paymentMethod._id);
//
//         var memberAmount = Session.get('memberAmount');
//         if (memberAmount) {
//           var paymentMethodFee = memberAmount * (paymentMethod.percentageFee / 100) + paymentMethod.flatFee;
//           console.log(paymentMethodFee)
//           Session.set('memberPaymentMethodFee', paymentMethodFee);
//         }
//       }
//     }
//   });

//   this.autorun(function() {
//     var member = AutoForm.getFieldValue('member', 'insertTradeForm');
//     Session.set('member', member);
//   });
// });

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
  memberAmount: function() {
    return Session.get('memberAmount');
  },
  fromCurrency: function() {
    return Session.get('fromCurrency');
  },
  memberPaymentMethod: function() {
    return Session.get('memberPaymentMethod');
  },
  memberPaymentMethodName: function() {
    return Session.get('memberPaymentMethodName');
  },
  companyAmount: function() {
    return Session.get('companyAmount');
  },
  toCurrency: function() {
    return Session.get('toCurrency');
  },
  companyPaymentMethod: function() {
    return Session.get('companyPaymentMethod');
  },
  showReceipt: function() {
    if (Session.get('companyAmount') > 0 && Session.get('memberAmount') > 0) {
      return true;
    }
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
  salesTax: function() {
    return Session.get('salesTax');
  },
  totalFees: function() {
    return Session.get('totalFees');
  },
  minusTotalFees: function() {
    return Session.get('memberAmount') - Session.get('totalFees');
  },
  marketValue: function() {
    if (Session.get('companyAmount')) {
      return Session.get('companyAmount') * Session.get('marketPrice');
    }
  },
  memberFound: function() {
    return Session.get('memberFound');
  }
});

Template.currencyConverter.events({
  "input [name=memberAmount]": function (event) {
    var memberAmount = parseFloat(event.target.value);
    if (isNaN(memberAmount)) {
      Session.set('memberAmount', NaN);
      Session.set('companyAmount', NaN);
    } else {
      Session.set('memberAmount', memberAmount);
      var totalFees = Session.get('totalFees');
      // var fees = Session.get('flatFee') + Session.get('memberPaymentMethodFee') + Session.get('companyPaymentMethodFee');
      if (memberAmount > totalFees) {
        var companyAmount = (memberAmount - totalFees) / Session.get('companyPrice');
        Session.set('companyAmount', accounting.toFixed(companyAmount, 4));
      } else {
        Session.set('companyAmount', 0);
      }
    }
  },
  "input [name=companyAmount]": function (event) {
    var companyAmount = parseFloat(event.target.value);
    if (isNaN(companyAmount)) {
      Session.set('buy.companyAmount', NaN);
      Session.set('buy.memberAmount', NaN);
    } else {
      Session.set('companyAmount', companyAmount);
      var totalFees = Session.get('totalFees');
      var memberAmount = companyAmount * Session.get('companyPrice') + totalFees;
      if (memberAmount > totalFees) {
        Session.set('memberAmount', accounting.toFixed(memberAmount, 2));
      } else {
        Session.set('memberAmount', 0);
      }
    }
  },
  "change [name=memberPaymentMethod]": function (event) {
    var paymentMethod = PaymentMethods.findOne(event.target.value);
    if (paymentMethod) {
      Session.set('memberPaymentMethod', paymentMethod._id);
      Session.set('memberPaymentMethodName', paymentMethod.name);
      var memberAmount = Session.get('memberAmount');
      if (memberAmount) {
        var paymentMethodFee = memberAmount * (paymentMethod.percentageFee / 100) + paymentMethod.flatFee;
        Session.set('memberPaymentMethodFee', paymentMethodFee);

        var flatFee = Session.get('flatFee');

        var fees = flatFee + paymentMethodFee;
        var salesTax = fees * 0.05 + fees * 0.09975;
        Session.set('salesTax', salesTax);

        var totalFees = flatFee + paymentMethodFee + salesTax;
        Session.set('totalFees', totalFees);
      }
    }

    // Session.set('buy.btc.paymentMethod', 'Cash');
    //
    // var cash = PaymentMethods.findOne({name: 'Cash', currencyCode: 'CAD'});
    // var percentageFee = Session.get('buy.memberAmount') * (cash.percentageFee / 100);
    // var fees = Session.get('buy.flatFee') + percentageFee + cash.flatFee;
    //
    // var tax = fees * 0.05 + fees * 0.09975;
    //
    // var memberAmountAfterFees = Session.get('buy.memberAmount') - fees - tax;
    //
    // var companyAmount = memberAmountAfterFees / Session.get('buy.companyPrice');
    // Session.set('buy.companyAmount', accounting.toFixed(companyAmount, 4));
  },
  'change [value="Debit card"]': function(event) {
    Session.set('buy.btc.paymentMethod', 'Debit card');

    var debitCard = PaymentMethods.findOne({name: 'Debit card', currencyCode: 'CAD'});
    var percentageFee = Session.get('buy.memberAmount') * (debitCard.percentageFee / 100);
    var fees = Session.get('buy.flatFee') + percentageFee + debitCard.flatFee;

    var tax = fees * 0.05 + fees * 0.09975;

    var memberAmountAfterFees = Session.get('buy.memberAmount') - fees - tax;

    var companyAmount = memberAmountAfterFees / Session.get('buy.companyPrice');
    Session.set('buy.companyAmount', accounting.toFixed(companyAmount, 4));
  },
  'change [value="Credit card"]': function(event) {
    Session.set('buy.btc.paymentMethod', 'Credit card');

    var creditCard = PaymentMethods.findOne({name: 'Credit card', currencyCode: 'CAD'});
    var percentageFee = Session.get('buy.memberAmount') * (creditCard.percentageFee / 100);
    var fees = Session.get('buy.flatFee') + percentageFee + creditCard.flatFee;

    var tax = fees * 0.05 + fees * 0.09975;

    var memberAmountAfterFees = Session.get('buy.memberAmount') - fees - tax;

    var companyAmount = memberAmountAfterFees / Session.get('buy.companyPrice');
    Session.set('buy.companyAmount', accounting.toFixed(companyAmount, 4));
  },
  'click #findMember': function() {
    var memberNumber = AutoForm.getFieldValue('memberNumber', 'insertTradeForm');
    var member = Meteor.call('findMember', memberNumber, function (error, result) {
      if (error) {
        Session.set('memberFound', false);
      } else {
        Session.set('memberFound', true);
      }
    });
  },
  "click input": function(event) {
    $(event.target).select();
  }
});

AutoForm.hooks({
  insertTradeForm: {
    onSuccess: function() {
      Router.go('/');
    }
  }
});
