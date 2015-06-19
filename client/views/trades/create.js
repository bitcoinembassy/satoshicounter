Template.tradesCreate.onCreated(function () {
  var priceType = Router.current().params.priceType;
  var baseCurrencySlug = Router.current().params.baseCurrency;
  var counterCurrencySlug = Router.current().params.counterCurrency;

  Session.set('priceType', priceType);

  Session.setDefault('paymentMethodForAmountReceived.flatFee', 0);
  Session.setDefault('paymentMethodForAmountReceived.calculatedFee', 0)

  Session.setDefault('paymentMethodForAmountSent.flatFee', 0);

  Session.setDefault('flatFee', 0);
  Session.setDefault('salesTax', 0);

  var companyPriceSubscription = this.subscribe('companyPrice', baseCurrencySlug, counterCurrencySlug);

  this.autorun(function () {
    if (companyPriceSubscription.ready()) {
      var baseCurrency = Currencies.findOne({slug: baseCurrencySlug});
      var counterCurrency = Currencies.findOne({slug: counterCurrencySlug});

      var companyPrice = CompanyPrices.findOne({baseCurrency: baseCurrency._id, counterCurrency: counterCurrency._id});
      var exchangeRate = ExchangeRates.findOne({provider: companyPrice.exchangeRateProvider, baseCurrency: baseCurrency._id, counterCurrency: counterCurrency._id});
      var exchangeRateProvider = ExchangeRateProviders.findOne(companyPrice.exchangeRateProvider);
      var timer = Timers.findOne({exchangeRateProvider: companyPrice.exchangeRateProvider});

      var priceType = Session.get('priceType');

      if (priceType === 'buy') {
        var calculatedCompanyPrice = exchangeRate.rate * (1 + companyPrice.percentageFeeForBuyers / 100);

        Session.set('currencyForAmountReceived', counterCurrency._id);
        Session.set('currencyForAmountSent', baseCurrency._id);
      } else if (priceType === 'sell') {
        var calculatedCompanyPrice = exchangeRate.rate * (1 + companyPrice.percentageFeeForSellers / 100);

        Session.set('currencyForAmountReceived', baseCurrency._id);
        Session.set('currencyForAmountSent', counterCurrency._id);
      }

      Session.set('marketPrice', exchangeRate.rate);
      Session.set('marketPriceProvider', exchangeRateProvider.name);
      Session.set('companyPrice', parseFloat(accounting.toFixed(calculatedCompanyPrice, 2)));

      Session.set('baseCurrency.code', baseCurrency.code);
      Session.set('baseCurrency.denomination', baseCurrency.denomination);
      Session.set('baseCurrency.slug', baseCurrency.slug);
      Session.set('baseCurrency.precision', baseCurrency.precision);

      Session.set('counterCurrency.code', counterCurrency.code);
      Session.set('counterCurrency.slug', counterCurrency.slug);
      Session.set('counterCurrency.precision', counterCurrency.precision);

      Session.set('timer.timeBeforeNextRefresh', timer.timeBeforeNextRefresh);
      Session.set('exchangeRateProvider.refreshInterval', exchangeRateProvider.refreshInterval);
    }
  });
});

Template.tradesCreate.helpers({
  priceType: function () {
    var priceType = Session.get('priceType');
    return priceType.charAt(0).toUpperCase() + priceType.substring(1);
  },
  companyPrice: function () {
    return Session.get('companyPrice');
  },
  buyPrice: function () {
    if (Session.get('priceType') === 'buy') {
      return true;
    }
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
    return PaymentMethods.find({currency: Session.get('currencyForAmountReceived'), canBeUsedForReceiving: true}).map(function(paymentMethod) {
      return {label: paymentMethod.name, value: paymentMethod._id};
    });
  },
  amountSent: function () {
    return Session.get('amountSent');
  },
  paymentMethodsForAmountSent: function () {
    return PaymentMethods.find({currency: Session.get('currencyForAmountSent'), canBeUsedForSending: true}).map(function(paymentMethod) {
      return {label: paymentMethod.name, value: paymentMethod._id};
    });
  },
  showMarketValue: function () {
    if (Session.get('amountSent') > 0 && Session.get('amountReceived') > 0) {
      return true;
    }
  },
  marketValue: function () {
    if (Session.get('priceType') === 'buy') {
      return Session.get('amountSent') * Session.get('marketPrice');
    } else {
      return Session.get('amountReceived') * Session.get('marketPrice');
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
  amountSentWithoutFees: function () {
    return Session.get('amountSentWithoutFees');
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
      Session.set('amountReceived', undefined);
      Session.set('amountSent', undefined);
    } else {
      Session.set('amountReceived', amountReceived);

      var flatFee = Session.get('flatFee');
      var salesTax = Session.get('salesTax');

      if (Session.get('priceType') === 'buy') {
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
      } else {
        var amountSentWithoutFees = parseFloat(accounting.toFixed(amountReceived * Session.get('companyPrice'), 2));
        Session.set('amountSentWithoutFees', amountSentWithoutFees);

        var percentageFee = Session.get('paymentMethodForAmountSent.percentageFee') / 100;

        if (percentageFee) {
          var calculatedFee = percentageFee * (amountSentWithoutFees - flatFee - salesTax);
          var amountSent = amountSentWithoutFees - flatFee - salesTax - calculatedFee;

          Session.set('paymentMethodForAmountSent.calculatedFee', parseFloat(accounting.toFixed(calculatedFee, 2)));
        } else {
          var amountSent = amountSentWithoutFees - flatFee - salesTax;
        }

        // var companyPaymentMethod = PaymentMethods.findOne(Session.get('companyPaymentMethod'));
        // var companyPaymentMethodFee = amountReceived * (companyPaymentMethod.percentageFee / 100) + companyPaymentMethod.flatFee;
        // Session.set('companyPaymentMethodFee', companyPaymentMethodFee);

        if (amountSent > flatFee + salesTax) {
          Session.set('amountSent', parseFloat(accounting.toFixed(amountSent, 2)));
        } else {
          Session.set('amountSent', 0);
        }
      }
    }
  },
  'input [name=amountSent]': function (event) {
    var amountSent = parseFloat(event.target.value);
    if (isNaN(amountSent)) {
      Session.set('amountSent', undefined);
      Session.set('amountReceived', undefined);
    } else {
      Session.set('amountSent', amountSent);

      var flatFee = Session.get('flatFee');
      var salesTax = Session.get('salesTax');

      if (Session.get('priceType') === 'buy') {
        var amountReceivedWithoutFees = parseFloat(accounting.toFixed(amountSent * Session.get('companyPrice'), 2));
        Session.set('amountReceivedWithoutFees', amountReceivedWithoutFees);

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
      } else {
        if (amountSent > flatFee + salesTax) {
          var percentageFee = Session.get('paymentMethodForAmountSent.percentageFee') / 100;

          if (percentageFee) {
            var amountSentWithoutFees = (amountSent + flatFee + salesTax + percentageFee * (flatFee + salesTax)) / (1 + percentageFee);
            var calculatedFee = amountSent - amountSentWithoutFees - flatFee - salesTax;

            Session.set('amountSentWithoutFees', parseFloat(accounting.toFixed(amountReceivedWithoutFees, 2)));
            Session.set('paymentMethodForAmountSent.calculatedFee', parseFloat(accounting.toFixed(calculatedFee, 2)));
          } else {
            var amountSentWithoutFees = amountSent + flatFee + salesTax;

            Session.set('amountSentWithoutFees', amountSentWithoutFees);
          }

          // var companyPaymentMethod = PaymentMethods.findOne(Session.get('companyPaymentMethod'));
          // var companyPaymentMethodFee = amountReceived * (companyPaymentMethod.percentageFee / 100) + companyPaymentMethod.flatFee;
          // Session.set('companyPaymentMethodFee', companyPaymentMethodFee);

          var amountReceived = Session.get('amountSentWithoutFees') / Session.get('companyPrice');
          var precision = Session.get('baseCurrency.precision');

          Session.set('amountReceived', parseFloat(accounting.toFixed(amountReceived, precision)));
        } else {
          Session.set('amountReceived', 0);
        }
      }
    }
  },
  'change [name=paymentMethodForAmountReceived]': function (event) {
    var paymentMethod = PaymentMethods.findOne(event.target.value);

    if (paymentMethod) {
      Session.set('paymentMethodForAmountReceived.name', paymentMethod.name.toLowerCase());
      Session.set('paymentMethodForAmountReceived.flatFee', paymentMethod.flatFeeForReceiving);
      Session.set('paymentMethodForAmountReceived.percentageFee', paymentMethod.percentageFeeForReceiving);

      var flatFee = paymentMethod.flatFeeForReceiving + Session.get('paymentMethodForAmountSent.flatFee');
      var salesTax = parseFloat(accounting.toFixed(flatFee * 0.05 + flatFee * 0.09975, Session.get('counterCurrency.precision')));

      Session.set('flatFee', flatFee);
      Session.set('salesTax', salesTax);
    } else {
      Session.set('paymentMethodForAmountReceived.name', undefined);
      Session.set('paymentMethodForAmountReceived.flatFee', 0);

      var flatFee = 0;
      var salesTax = 0;

      Session.set('flatFee', 0);
      Session.set('salesTax', 0);
    }

    var amountReceived = Session.get('amountReceived');
    var amountSent = Session.get('amountSent');

    if (amountReceived && amountSent) {
      if (Session.get('priceType') === 'buy') {
        if (paymentMethod && paymentMethod.percentageFeeForReceiving) {
          var percentageFee = paymentMethod.percentageFeeForReceiving / 100;

          var amountReceivedWithoutFees = (amountReceived - flatFee - salesTax - percentageFee * (flatFee + salesTax)) / (1 + percentageFee);
          var calculatedFee = amountReceived - amountReceivedWithoutFees - flatFee - salesTax;

          Session.set('amountReceivedWithoutFees', parseFloat(accounting.toFixed(amountReceivedWithoutFees, 2)));
          Session.set('paymentMethodForAmountReceived.calculatedFee', parseFloat(accounting.toFixed(calculatedFee, 2)));
        } else {
          var amountReceivedWithoutFees = amountReceived - flatFee - salesTax;

          Session.set('amountReceivedWithoutFees', amountReceivedWithoutFees);
          Session.set('paymentMethodForAmountReceived.calculatedFee', 0);
        }

        var amountSent = Session.get('amountReceivedWithoutFees') / Session.get('companyPrice');
        var precision = Session.get('baseCurrency.precision');

        Session.set('amountSent', parseFloat(accounting.toFixed(amountSent, precision)));
      } else {
        var amountSentWithoutFees = amountSent + flatFee + salesTax;

        Session.set('amountSentWithoutFees', amountSentWithoutFees);
      }
    }
  },
  'change [name=paymentMethodForAmountSent]': function (event) {
    var paymentMethod = PaymentMethods.findOne(event.target.value);

    if (paymentMethod) {
      Session.set('paymentMethodForAmountSent.name', paymentMethod.name.toLowerCase());
      Session.set('paymentMethodForAmountSent.flatFee', paymentMethod.flatFeeForSending);

      var flatFee = Session.get('paymentMethodForAmountReceived.flatFee') + paymentMethod.flatFeeForSending;
      var salesTax = parseFloat(accounting.toFixed(flatFee * 0.05 + flatFee * 0.09975, Session.get('counterCurrency.precision')));

      Session.set('flatFee', flatFee);
      Session.set('salesTax', salesTax);
    } else {
      Session.set('paymentMethodForAmountSent.name', undefined);
      Session.set('paymentMethodForAmountSent.flatFee', 0);

      var flatFee = 0;
      var salesTax = 0;

      Session.set('flatFee', 0);
      Session.set('salesTax', 0);
    }

    var amountReceived = Session.get('amountReceived');
    var amountSent = Session.get('amountSent');

    if (amountReceived && amountSent) {
      if (Session.get('priceType') === 'buy') {
        var amountReceivedWithoutFees = amountReceived - flatFee - salesTax - Session.get('paymentMethodForAmountReceived.calculatedFee');

        Session.set('amountReceivedWithoutFees', amountReceivedWithoutFees);

        var amountSent = amountReceivedWithoutFees / Session.get('companyPrice');
        var precision = Session.get('baseCurrency.precision');

        Session.set('amountSent', parseFloat(accounting.toFixed(amountSent, precision)));
      } else {
        var amountSentWithoutFees = amountSent + flatFee + salesTax;
        var amountReceived = amountSentWithoutFees / Session.get('companyPrice');
        var precision = Session.get('baseCurrency.precision');

        Session.set('amountSentWithoutFees', amountSentWithoutFees);
        Session.set('amountReceived', parseFloat(accounting.toFixed(amountReceived, precision)));
      }
    }
  },
  'click #switchCurrencies': function () {
    var priceType = Session.get('priceType');

    if (priceType === 'buy') {
      Session.set('priceType', 'sell');
    } else if (priceType === 'sell') {
      Session.set('priceType', 'buy');
    }

    Session.set('amountReceived', undefined);
    Session.set('amountSent', undefined);

    Session.set('paymentMethodForAmountReceived.name', undefined);
    Session.set('paymentMethodForAmountSent.name', undefined);

    Session.set('paymentMethodForAmountReceived.flatFee', 0);
    Session.set('paymentMethodForAmountSent.flatFee', 0);

    Session.set('paymentMethodForAmountReceived.calculatedFee', undefined);

    Session.set('flatFee', 0);
    Session.set('salesTax', 0);

    Router.go('/' + Session.get('priceType') + '-' + Session.get('baseCurrency.slug') + '/' + Session.get('counterCurrency.slug'));
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
