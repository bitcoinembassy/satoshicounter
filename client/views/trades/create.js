Template.tradesCreate.onCreated(function() {
  var memberCurrency = Currencies.findOne({code: Router.current().params.memberCurrency.toUpperCase()});
  var companyCurrency = Currencies.findOne({code: Router.current().params.companyCurrency.toUpperCase()});

  this.autorun(function() {
    var exchangeRate = ExchangeRates.findOne({fromCurrency: memberCurrency._id, toCurrency: companyCurrency._id});
    var companyPrice = exchangeRate.value * (1 + exchangeRate.percentageFee / 100);

    Session.set('companyPrice', parseFloat(accounting.toFixed(companyPrice, 2)));
    Session.set('exchangeRateId', exchangeRate._id);
    Session.set('exchangeRate.flatFee', exchangeRate.flatFee);
    Session.set('marketPrice', exchangeRate.value);

    var mainCurrency = Currencies.findOne(exchangeRate.mainCurrency);
    Session.set('mainCurrencyPrecision', mainCurrency.precision);
    Session.set('mainCurrency', mainCurrency.code);
  });

  var timers = this.subscribe('timers');

  this.autorun(function() {
    if (timers.ready()) {
      var timer = Timers.findOne({exchangeRate: Session.get('exchangeRateId')});
      Session.set('timerValue', timer.value);
    }
  });

  Session.set('memberCurrencyPrecision', memberCurrency.precision);
  Session.set('memberCurrency', memberCurrency.code);
  
  Session.set('companyCurrencyPrecision', companyCurrency.precision);
  Session.set('companyCurrency', companyCurrency.code);

  var memberPaymentMethod = PaymentMethods.findOne(memberCurrency.mainPaymentMethod);
  var companyPaymentMethod = PaymentMethods.findOne(companyCurrency.mainPaymentMethod);

  Session.setDefault('memberPaymentMethod', memberPaymentMethod._id);
  Session.setDefault('companyPaymentMethod', companyPaymentMethod._id);

  var flatFee = Session.get('exchangeRate.flatFee') + memberPaymentMethod.flatFee + companyPaymentMethod.flatFee;
  var salesTax = parseFloat(accounting.toFixed(flatFee * 0.05 + flatFee * 0.09975, 2));

  Session.set('memberPaymentMethod.flatFee', memberPaymentMethod.flatFee);
  Session.set('companyPaymentMethod.flatFee', companyPaymentMethod.flatFee);
  Session.set('flatFee', flatFee);
  Session.set('salesTax', salesTax);
});

Template.tradesCreate.helpers({
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
  memberCurrency: function() {
    return Session.get('memberCurrency');
  },
  memberPaymentMethod: function() {
    return Session.get('memberPaymentMethod');
  },
  companyAmount: function() {
    return Session.get('companyAmount');
  },
  companyCurrency: function() {
    return Session.get('companyCurrency');
  },
  companyPaymentMethod: function() {
    return Session.get('companyPaymentMethod');
  },
  showReceipt: function() {
    if (Session.get('companyAmount') > 0 && Session.get('memberAmount') > 0) {
      return true;
    }
  },
  memberPaymentMethodName: function() {
    return Session.get('memberPaymentMethod.name');
  },
  memberPaymentMethodPercentageFee: function() {
    return Session.get('memberPaymentMethod.percentageFee');
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
  memberAmountSubtotal: function() {
    return Session.get('memberAmountSubtotal');
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

Template.tradesCreate.events({
  "input [name=memberAmount]": function (event) {
    var memberAmount = parseFloat(event.target.value);
    if (isNaN(memberAmount)) {
      Session.set('memberAmount', NaN);
      Session.set('companyAmount', NaN);
    } else {
      Session.set('memberAmount', memberAmount);

      var flatFee = Session.get('flatFee');
      var salesTax = Session.get('salesTax');

      if (memberAmount > flatFee + salesTax) {
        var memberPaymentMethod = PaymentMethods.findOne(Session.get('memberPaymentMethod'));

        if (memberPaymentMethod.percentageFee) {
          var percentageFee = memberPaymentMethod.percentageFee / 100;

          var memberAmountSubtotal = (memberAmount - flatFee - salesTax - percentageFee * (flatFee + salesTax)) / (1 + percentageFee);
          var memberPaymentMethodFee = memberAmount - memberAmountSubtotal - flatFee - salesTax;

          Session.set('memberAmountSubtotal', parseFloat(accounting.toFixed(memberAmountSubtotal, 2)));
          Session.set('memberPaymentMethodFee', parseFloat(accounting.toFixed(memberPaymentMethodFee, 2)));
        } else {
          var memberAmountSubtotal = memberAmount - flatFee - salesTax;

          Session.set('memberAmountSubtotal', memberAmountSubtotal);
        }

        // var companyPaymentMethod = PaymentMethods.findOne(Session.get('companyPaymentMethod'));
        // var companyPaymentMethodFee = memberAmount * (companyPaymentMethod.percentageFee / 100) + companyPaymentMethod.flatFee;
        // Session.set('companyPaymentMethodFee', companyPaymentMethodFee);

        var companyAmount = Session.get('memberAmountSubtotal') / Session.get('companyPrice');
        var precision = Session.get('companyCurrencyPrecision');

        Session.set('companyAmount', parseFloat(accounting.toFixed(companyAmount, precision)));
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

      var memberAmountSubtotal = parseFloat(accounting.toFixed(companyAmount * Session.get('companyPrice'), 2));
      Session.set('memberAmountSubtotal', memberAmountSubtotal);

      var flatFee = Session.get('flatFee');
      var salesTax = Session.get('salesTax');

      var memberPaymentMethod = PaymentMethods.findOne(Session.get('memberPaymentMethod'));

      if (memberPaymentMethod.percentageFee) {
        var percentageFee = memberPaymentMethod.percentageFee / 100;

        var memberPaymentMethodFee = percentageFee * (memberAmountSubtotal + flatFee + salesTax);
        var memberAmount = memberAmountSubtotal + flatFee + salesTax + memberPaymentMethodFee;

        Session.set('memberPaymentMethodFee', parseFloat(accounting.toFixed(memberPaymentMethodFee, 2)));
      } else {
        var memberAmount = memberAmountSubtotal + flatFee + salesTax;
      }

      // var companyPaymentMethod = PaymentMethods.findOne(Session.get('companyPaymentMethod'));
      // var companyPaymentMethodFee = memberAmount * (companyPaymentMethod.percentageFee / 100) + companyPaymentMethod.flatFee;
      // Session.set('companyPaymentMethodFee', companyPaymentMethodFee);

      if (memberAmount > flatFee + salesTax) {
        Session.set('memberAmount', parseFloat(accounting.toFixed(memberAmount, 2)));
      } else {
        Session.set('memberAmount', 0);
      }
    }
  },
  "change [name=memberPaymentMethod]": function (event) {
    var paymentMethod = PaymentMethods.findOne(event.target.value);

    if (paymentMethod) {
      Session.set('memberPaymentMethod', paymentMethod._id);

      var paymentMethodCurrency = Currencies.findOne(paymentMethod.currency);
      var memberCurrency = Session.get('memberCurrency');

      if (paymentMethodCurrency.code === memberCurrency) {
        var flatFee = Session.get('exchangeRate.flatFee') + paymentMethod.flatFee + Session.get('companyPaymentMethod.flatFee');
        var salesTax = parseFloat(accounting.toFixed(flatFee * 0.05 + flatFee * 0.09975, 2));

        Session.set('memberPaymentMethod.flatFee', paymentMethod.flatFee);
        Session.set('flatFee', flatFee);
        Session.set('salesTax', salesTax);

        Session.set('memberPaymentMethod.name', paymentMethod.name);
        Session.set('memberPaymentMethod.percentageFee', paymentMethod.percentageFee);

        var memberAmount = Session.get('memberAmount');
        var companyAmount = Session.get('companyAmount');

        if (memberAmount && companyAmount) {
          if (paymentMethod.percentageFee) {
            var percentageFee = paymentMethod.percentageFee / 100;

            var memberAmountSubtotal = (memberAmount - flatFee - salesTax - percentageFee * (flatFee + salesTax)) / (1 + percentageFee);
            var memberPaymentMethodFee = memberAmount - memberAmountSubtotal - flatFee - salesTax;

            Session.set('memberAmountSubtotal', parseFloat(accounting.toFixed(memberAmountSubtotal, 2)));
            Session.set('memberPaymentMethodFee', parseFloat(accounting.toFixed(memberPaymentMethodFee, 2)));
          } else {
            var memberAmountSubtotal = memberAmount - flatFee - salesTax;

            Session.set('memberAmountSubtotal', memberAmountSubtotal);
            Session.set('memberPaymentMethodFee', 0);
          }

          var companyAmount = Session.get('memberAmountSubtotal') / Session.get('companyPrice');
          var precision = Session.get('companyCurrencyPrecision');

          Session.set('companyAmount', parseFloat(accounting.toFixed(companyAmount, precision)));
        }
      } else {
        if (paymentMethodCurrency.code === Session.get('companyCurrency')) {
          var companyAmount = Session.get('companyAmount');
          Session.set('memberAmount', companyAmount);

          // calculate a new memberAmount based on the previous companyAmount
          Session.set('companyAmount', NaN);

          var memberCurrency = Currencies.findOne({code: Session.get('memberCurrency')});
          var companyPaymentMethod = PaymentMethods.findOne(memberCurrency.mainPaymentMethod);

          Session.set('companyPaymentMethod', companyPaymentMethod._id);

          Router.go('/' + paymentMethodCurrency.code.toLowerCase() + '/' + Session.get('memberCurrency').toLowerCase());
        }
      }
    }
  },
  'click #switchCurrencies': function() {
    var companyAmount = Session.get('companyAmount');

    Session.set('memberAmount', companyAmount);

    var memberPaymentMethod = Session.get('memberPaymentMethod');
    var companyPaymentMethod = Session.get('companyPaymentMethod');

    Session.set('memberPaymentMethod', companyPaymentMethod);
    Session.set('companyPaymentMethod', memberPaymentMethod);

    // calculate a new memberAmount based on the previous companyAmou
    Session.set('companyAmount', NaN);
    Router.go('/' + Session.get('companyCurrency').toLowerCase() + '/' + Session.get('memberCurrency').toLowerCase());
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
    onSuccess: function (formType, result) {
      console.log(result);
      Router.go('/');
    }
  }
});
