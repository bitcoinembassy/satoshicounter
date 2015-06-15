Template.tradesCreate.onCreated(function() {
  var memberCurrency = Currencies.findOne({code: Router.current().params.memberCurrency.toUpperCase()});
  var companyCurrency = Currencies.findOne({code: Router.current().params.companyCurrency.toUpperCase()});

  var exchangeRate = ExchangeRates.findOne({fromCurrency: memberCurrency._id, toCurrency: companyCurrency._id});

  var companyPrice = exchangeRate.value * (1 + exchangeRate.percentageFee / 100);
  Session.set('companyPrice', Math.round(companyPrice * 100) / 100);

  var mainCurrency = Currencies.findOne(exchangeRate.mainCurrency);
  Session.set('mainCurrencyPrecision', mainCurrency.precision);
  Session.set('mainCurrency', mainCurrency.code);

  var timers = this.subscribe('timers');

  this.autorun(function() {
    if (timers.ready()) {
      var timer = Timers.findOne({exchangeRate: exchangeRate._id});
      Session.set('timerValue', timer.value);
    }
  });

  Session.set('memberCurrency', memberCurrency.code);
  Session.set('companyCurrency', companyCurrency.code);
  Session.set('memberPaymentMethod', memberCurrency.mainPaymentMethod);
  Session.set('companyPaymentMethod', companyCurrency.mainPaymentMethod);

  Session.set('flatFee', exchangeRate.flatFee);
  var salesTax = exchangeRate.flatFee * 0.05 + exchangeRate.flatFee * 0.09975;
  Session.set('salesTax', Math.round(salesTax * 100) / 100);

  Session.set('marketPrice', exchangeRate.value);
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
    return Session.get('memberPaymentMethodName');
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
    return Session.get('memberAmount') - Session.get('memberPaymentMethodFee') - Session.get('companyPaymentMethodFee') - Session.get('flatFee') - Session.get('salesTax');
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

      var memberPaymentMethod = PaymentMethods.findOne(Session.get('memberPaymentMethod'));
      var memberPaymentMethodFee = memberAmount * (memberPaymentMethod.percentageFee / 100) + memberPaymentMethod.flatFee;
      Session.set('memberPaymentMethodFee', memberPaymentMethodFee);

      var companyPaymentMethod = PaymentMethods.findOne(Session.get('companyPaymentMethod'));
      var companyPaymentMethodFee = memberAmount * (companyPaymentMethod.percentageFee / 100) + companyPaymentMethod.flatFee;
      Session.set('companyPaymentMethodFee', companyPaymentMethodFee);

      var totalFees = memberPaymentMethodFee + companyPaymentMethodFee + Session.get('flatFee') + Session.get('salesTax');

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

      var memberAmount = companyAmount * Session.get('companyPrice');

      var memberPaymentMethod = PaymentMethods.findOne(Session.get('memberPaymentMethod'));
      var memberPaymentMethodFee = memberAmount * (memberPaymentMethod.percentageFee / 100) + memberPaymentMethod.flatFee;
      Session.set('memberPaymentMethodFee', memberPaymentMethodFee);

      var companyPaymentMethod = PaymentMethods.findOne(Session.get('companyPaymentMethod'));
      var companyPaymentMethodFee = memberAmount * (companyPaymentMethod.percentageFee / 100) + companyPaymentMethod.flatFee;
      Session.set('companyPaymentMethodFee', companyPaymentMethodFee);

      var totalFees = memberPaymentMethodFee + companyPaymentMethodFee + Session.get('flatFee') + Session.get('salesTax');

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

      var paymentMethodCurrency = Currencies.findOne(paymentMethod.currency);
      var memberCurrency = Session.get('memberCurrency');

      if (paymentMethodCurrency.code === memberCurrency) {
        var memberAmount = Session.get('memberAmount');

        if (memberAmount) {
          var paymentMethodFee = memberAmount * (paymentMethod.percentageFee / 100) + paymentMethod.flatFee;
          Session.set('memberPaymentMethodFee', paymentMethodFee);

          if (paymentMethodFee) {
            Session.set('memberPaymentMethodName', paymentMethod.name);
          }
        }
      } else {
        if (paymentMethodCurrency.code === Session.get('companyCurrency')) {
          var memberAmount = Session.get('memberAmount');
          var companyAmount = Session.get('companyAmount');
          Session.set('memberAmount', companyAmount);
          Session.set('companyAmount', memberAmount);
          Router.go('/' + paymentMethodCurrency.code.toLowerCase() + '/' + memberCurrency.toLowerCase());
        }
      }
    }
  },
  'click #switchCurrencies': function() {
    var memberAmount = Session.get('memberAmount');
    var companyAmount = Session.get('companyAmount');
    Session.set('memberAmount', companyAmount);
    Session.set('companyAmount', memberAmount);
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
