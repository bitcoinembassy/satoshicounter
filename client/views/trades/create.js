Template.tradesCreate.onCreated(function () {
  var priceType = Router.current().params.priceType;
  var baseCurrencySlug = Router.current().params.baseCurrency;
  var counterCurrencySlug = Router.current().params.counterCurrency;

  var companyPriceSubscription = this.subscribe('companyPrice', baseCurrencySlug, counterCurrencySlug);

  this.autorun(function () {
    if (companyPriceSubscription.ready()) {
      var baseCurrency = Currencies.findOne({slug: baseCurrencySlug});
      var counterCurrency = Currencies.findOne({slug: counterCurrencySlug});

      var companyPrice = CompanyPrices.findOne({baseCurrency: baseCurrency._id, counterCurrency: counterCurrency._id});
      var exchangeRate = ExchangeRates.findOne({provider: companyPrice.exchangeRateProvider, baseCurrency: baseCurrency._id, counterCurrency: counterCurrency._id});
      var exchangeRateProvider = ExchangeRateProviders.findOne(companyPrice.exchangeRateProvider);
      var timer = Timers.findOne({exchangeRateProvider: companyPrice.exchangeRateProvider});

      if (priceType === 'buy') {
        var calculatedCompanyPrice = exchangeRate.rate * (1 + companyPrice.percentageFeeForBuyers / 100);

        Session.set('priceType', 'Buy');
      } else if (priceType === 'sell') {
        var calculatedCompanyPrice = exchangeRate.rate * (1 + companyPrice.percentageFeeForSellers / 100);

        Session.set('priceType', 'Sell');
      }

      Session.set('marketPrice', exchangeRate.rate);
      Session.set('marketPriceProvider', exchangeRateProvider.name);
      Session.set('companyPrice', parseFloat(accounting.toFixed(calculatedCompanyPrice, 2)));

      Session.set('baseCurrency', baseCurrency._id);
      Session.set('baseCurrency.code', baseCurrency.code);
      Session.set('baseCurrency.denomination', baseCurrency.denomination);
      Session.set('baseCurrency.precision', baseCurrency.precision);

      Session.set('counterCurrency', counterCurrency._id);
      Session.set('counterCurrency.code', counterCurrency.code);
      Session.set('counterCurrency.precision', counterCurrency.precision);

      Session.set('timer.timeBeforeNextRefresh', timer.timeBeforeNextRefresh);
      Session.set('exchangeRateProvider.refreshInterval', exchangeRateProvider.refreshInterval);
    }
  });

  Session.setDefault('paymentMethodForAmountReceived.flatFee', 0);
  Session.setDefault('paymentMethodForAmountSent.flatFee', 0);

  Session.setDefault('flatFee', 0);
  Session.setDefault('salesTax', 0);
});

Template.tradesCreate.helpers({
  priceType: function () {
    return Session.get('priceType');
  },
  companyPrice: function () {
    return Session.get('companyPrice');
  },
  baseCurrency: function () {
    return Session.get('baseCurrency.code');
  },
  baseCurrencyDenomination: function () {
    return Session.get('baseCurrency.denomination');
  },
  counterCurrency: function () {
    return Session.get('counterCurrency.code');
  },
  timeBeforeNextRefresh: function () {
    return 100 - Session.get('timer.timeBeforeNextRefresh') / Session.get('exchangeRateProvider.refreshInterval') * 100;
  },
  amountReceived: function () {
    return Session.get('amountReceived');
  },
  paymentMethodsForAmountReceived: function () {
    return PaymentMethods.find({currency: Session.get('counterCurrency')}).map(function(paymentMethod) {
      return {label: paymentMethod.name, value: paymentMethod._id};
    });
  },
  amountSent: function () {
    return Session.get('amountSent');
  },
  paymentMethodsForAmountSent: function () {
    return PaymentMethods.find({currency: Session.get('baseCurrency')}).map(function(paymentMethod) {
      return {label: paymentMethod.name, value: paymentMethod._id};
    });
  },
  showMarketValue: function () {
    if (Session.get('amountSent') > 0 && Session.get('amountReceived') > 0) {
      return true;
    }
  },
  marketValue: function () {
    if (Session.get('amountSent')) {
      return Session.get('amountSent') * Session.get('marketPrice');
    }
  },
  marketValueProvider: function () {
    return Session.get('marketPriceProvider');
  },
  showReceipt: function () {
    if (Session.get('amountSent') > 0 && Session.get('amountReceived') > 0) {
      if (Session.get('paymentMethodForAmountReceived.name') && Session.get('paymentMethodForAmountSent.name')) {
        return true;
      }
    }
  },
  amountReceivedWithoutFees: function () {
    return Session.get('amountReceivedWithoutFees');
  },
  flatFee: function () {
    return Session.get('flatFee');
  },
  salesTax: function () {
    return Session.get('salesTax');
  },
  paymentMethodForAmountReceived: function () {
    return Session.get('paymentMethodForAmountReceived.name');
  },
  percentageFeeForAmountReceived: function () {
    return Session.get('paymentMethodForAmountReceived.percentageFee');
  },
  calculatedFeeForAmountReceived: function () {
    return Session.get('paymentMethodForAmountReceived.calculatedFee');
  },
  calculatedFeeForAmountSent: function () {
    return Session.get('companyPaymentMethodFee');
  },
  memberFound: function () {
    return Session.get('memberFound');
  }
});

Template.tradesCreate.events({
  'input [name=amountReceived]': function (event) {
    var amountReceived = parseFloat(event.target.value);
    if (isNaN(amountReceived)) {
      Session.set('amountReceived', NaN);
      Session.set('amountSent', NaN);
    } else {
      Session.set('amountReceived', amountReceived);

      var flatFee = Session.get('flatFee');
      var salesTax = Session.get('salesTax');

      if (amountReceived > flatFee + salesTax) {
        var percentageFee = Session.get('paymentMethodForAmountReceived.percentageFee') / 100;

        if (percentageFee) {
          var amountReceivedWithoutFees = (amountReceived - flatFee - salesTax - percentageFee * (flatFee + salesTax)) / (1 + percentageFee);
          var calculatedFee = amountReceived - amountReceivedWithoutFees - flatFee - salesTax;

          Session.set('amountReceivedWithoutFees', parseFloat(accounting.toFixed(amountReceivedWithoutFees, 2)));
          Session.set('paymentMethodForAmountReceived.calculatedFee', parseFloat(accounting.toFixed(calculatedFee, 2)));
        } else {
          var amountReceivedWithoutFees = amountReceived - flatFee - salesTax;

          Session.set('amountReceivedWithoutFees', amountReceivedWithoutFees);
        }

        // var companyPaymentMethod = PaymentMethods.findOne(Session.get('companyPaymentMethod'));
        // var companyPaymentMethodFee = amountReceived * (companyPaymentMethod.percentageFee / 100) + companyPaymentMethod.flatFee;
        // Session.set('companyPaymentMethodFee', companyPaymentMethodFee);

        var amountSent = Session.get('amountReceivedWithoutFees') / Session.get('companyPrice');
        var precision = Session.get('baseCurrency.precision');

        Session.set('amountSent', parseFloat(accounting.toFixed(amountSent, precision)));
      } else {
        Session.set('amountSent', 0);
      }
    }
  },
  'input [name=amountSent]': function (event) {
    var amountSent = parseFloat(event.target.value);
    if (isNaN(amountSent)) {
      Session.set('amountSent', NaN);
      Session.set('amountReceived', NaN);
    } else {
      Session.set('amountSent', amountSent);

      var amountReceivedWithoutFees = parseFloat(accounting.toFixed(amountSent * Session.get('companyPrice'), 2));
      Session.set('amountReceivedWithoutFees', amountReceivedWithoutFees);

      var flatFee = Session.get('flatFee');
      var salesTax = Session.get('salesTax');

      var percentageFee = Session.get('paymentMethodForAmountReceived.percentageFee') / 100;

      if (percentageFee) {
        var calculatedFee = percentageFee * (amountReceivedWithoutFees + flatFee + salesTax);
        var amountReceived = amountReceivedWithoutFees + flatFee + salesTax + calculatedFee;

        Session.set('paymentMethodForAmountReceived.calculatedFee', parseFloat(accounting.toFixed(calculatedFee, 2)));
      } else {
        var amountReceived = amountReceivedWithoutFees + flatFee + salesTax;
      }

      // var companyPaymentMethod = PaymentMethods.findOne(Session.get('companyPaymentMethod'));
      // var companyPaymentMethodFee = amountReceived * (companyPaymentMethod.percentageFee / 100) + companyPaymentMethod.flatFee;
      // Session.set('companyPaymentMethodFee', companyPaymentMethodFee);

      if (amountReceived > flatFee + salesTax) {
        Session.set('amountReceived', parseFloat(accounting.toFixed(amountReceived, 2)));
      } else {
        Session.set('amountReceived', 0);
      }
    }
  },
  'change [name=paymentMethodForAmountReceived]': function (event) {
    var paymentMethod = PaymentMethods.findOne(event.target.value);

    if (paymentMethod) {
      var flatFee = paymentMethod.flatFeeForReceiving + Session.get('paymentMethodForAmountSent.flatFee');
      var salesTax = parseFloat(accounting.toFixed(flatFee * 0.05 + flatFee * 0.09975, Session.get('counterCurrency.precision')));

      Session.set('paymentMethodForAmountReceived.name', paymentMethod.name.toLowerCase());
      Session.set('paymentMethodForAmountReceived.flatFee', paymentMethod.flatFeeForReceiving);
      Session.set('paymentMethodForAmountReceived.percentageFee', paymentMethod.percentageFeeForReceiving);

      Session.set('flatFee', flatFee);
      Session.set('salesTax', salesTax);
    } else {
      Session.set('paymentMethodForAmountReceived.name', undefined);

      Session.set('flatFee', 0);
      Session.set('salesTax', 0);
    }

    var amountReceived = Session.get('amountReceived');
    var amountSent = Session.get('amountSent');

    if (amountReceived && amountSent) {
      if (paymentMethod && paymentMethod.percentageFeeForReceiving) {
        var percentageFee = paymentMethod.percentageFeeForReceiving / 100;

        var amountReceivedWithoutFees = (amountReceived - flatFee - salesTax - percentageFee * (flatFee + salesTax)) / (1 + percentageFee);
        var calculatedFee = amountReceived - amountReceivedWithoutFees - flatFee - salesTax;

        Session.set('amountReceivedWithoutFees', parseFloat(accounting.toFixed(amountReceivedWithoutFees, 2)));
        Session.set('paymentMethodForAmountReceived.calculatedFee', parseFloat(accounting.toFixed(calculatedFee, 2)));
      } else {
        var amountReceivedWithoutFees = amountReceived - Session.get('flatFee') - Session.get('salesTax');

        Session.set('amountReceivedWithoutFees', amountReceivedWithoutFees);
        Session.set('paymentMethodForAmountReceived.calculatedFee', 0);
      }

      var amountSent = Session.get('amountReceivedWithoutFees') / Session.get('companyPrice');
      var precision = Session.get('baseCurrency.precision');

      Session.set('amountSent', parseFloat(accounting.toFixed(amountSent, precision)));
    }
  },
  'change [name=paymentMethodForAmountSent]': function (event) {
    var paymentMethod = PaymentMethods.findOne(event.target.value);

    if (paymentMethod) {
      Session.set('paymentMethodForAmountSent.name', paymentMethod.name.toLowerCase());
      Session.set('paymentMethodForAmountSent.flatFee', paymentMethod.flatFeeForSending);
    } else {
      Session.set('paymentMethodForAmountSent.name', undefined);
    }
  },
  'click #switchCurrencies': function () {
    var amountSent = Session.get('amountSent');

    Session.set('amountReceived', amountSent);

    var memberPaymentMethod = Session.get('memberPaymentMethod');
    var companyPaymentMethod = Session.get('companyPaymentMethod');

    Session.set('memberPaymentMethod', companyPaymentMethod);
    Session.set('companyPaymentMethod', memberPaymentMethod);

    // calculate a new amountReceived based on the previous companyAmou
    Session.set('amountSent', NaN);
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
  'click input[type=number]': function (event) {
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
