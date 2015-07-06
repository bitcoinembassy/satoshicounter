Template.tradesCreate.onCreated(function () {
  var priceType = Router.current().params.priceType;
  var baseCurrencySlug = Router.current().params.baseCurrency;
  var counterCurrencySlug = Router.current().params.counterCurrency;

  Session.set('priceType', priceType);
  Session.set('showMemberForm', false);
  var companyPriceSubscription = this.subscribe('companyPrice', baseCurrencySlug, counterCurrencySlug);

  this.autorun(function () {
    if (companyPriceSubscription.ready()) {
      var baseCurrency = Currencies.findOne({slug: baseCurrencySlug});
      var counterCurrency = Currencies.findOne({slug: counterCurrencySlug});

      var companyPrice = CompanyPrices.findOne({baseCurrency: baseCurrency._id, counterCurrency: counterCurrency._id});
      var exchangeRate = ExchangeRates.findOne({provider: companyPrice.exchangeRateProvider, baseCurrency: baseCurrency._id, counterCurrency: counterCurrency._id});
      var exchangeRateProvider = ExchangeRateProviders.findOne(companyPrice.exchangeRateProvider);

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

      Session.set('companyPrice', parseFloat(accounting.toFixed(calculatedCompanyPrice, 2)));
      Session.set('exchangeRate', exchangeRate.rate);
      Session.set('exchangeRateProvider', exchangeRateProvider.name);

      Session.set('lastPriceUpdate', exchangeRate.updatedAt);
      Session.set('progress', moment().diff(exchangeRate.updatedAt) / 1000);
      Session.set('priceRefreshInterval', exchangeRateProvider.refreshInterval);

      Session.set('baseCurrency', baseCurrency._id);
      Session.set('baseCurrency.code', baseCurrency.code);
      Session.set('baseCurrency.denomination', baseCurrency.denomination);
      Session.set('baseCurrency.slug', baseCurrency.slug);
      Session.set('baseCurrency.precision', baseCurrency.precision);

      Session.set('counterCurrency', counterCurrency._id);
      Session.set('counterCurrency.code', counterCurrency.code);
      Session.set('counterCurrency.slug', counterCurrency.slug);
      Session.set('counterCurrency.precision', counterCurrency.precision);
    }
  });

  Meteor.setInterval(function () {
    var progress = moment().diff(Session.get('lastPriceUpdate')) / 1000;
    Session.set('progress', progress);
  }, 5000);
});

Template.tradesCreate.onDestroyed(function () {
  Session.set('amountReceived', null);
  Session.set('counterCurrency', undefined);
  Session.set('paymentMethodForAmountReceived', undefined);

  Session.set('amountSent', null);
  Session.set('baseCurrency', undefined);
  Session.set('paymentMethodForAmountSent', undefined);

  Session.set('paymentMethodForAmountReceived.calculatedFee', undefined);
  Session.set('paymentMethodForAmountReceived.percentageFee', undefined);
  Session.set('paymentMethodForAmountReceived.name', undefined);

  Session.set('marketPrice', undefined);
  Session.set('marketPriceCurrency', undefined);
  Session.set('marketPriceProvider', undefined);
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
    if (Session.equals('priceType', 'buy')) {
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
  progressBar: function () {
    return Session.get('progress') / Session.get('priceRefreshInterval') * 100;
  },
  amountReceived: function () {
    return Session.get('amountReceived');
  },
  paymentMethodForAmountReceived: function() {
    var paymentMethodId = Session.get('paymentMethodForAmountReceived');
    if (paymentMethodId !== undefined) {
      return paymentMethodId;
    } else {
      if (Session.equals('priceType', 'buy')) {
        var paymentMethod = PaymentMethods.findOne({currency: Session.get('counterCurrency'), canBeUsedForReceiving: true});
      } else {
        var paymentMethod = PaymentMethods.findOne({currency: Session.get('baseCurrency'), canBeUsedForReceiving: true});
      }

      if (paymentMethod) {
        Session.set('paymentMethodForAmountReceived', paymentMethod._id);
        Session.set('paymentMethodForAmountReceived.flatFee', paymentMethod.flatFeeForReceiving);
        Session.set('paymentMethodForAmountReceived.percentageFee', paymentMethod.percentageFeeForReceiving);
      }
    }
  },
  paymentMethodsForAmountReceived: function () {
    return PaymentMethods.find({currency: Session.get('currencyForAmountReceived'), canBeUsedForReceiving: true}).map(function(paymentMethod) {
      return {label: paymentMethod.name, value: paymentMethod._id};
    });
  },
  amountSent: function () {
    return Session.get('amountSent');
  },
  paymentMethodForAmountSent: function () {
    var paymentMethodId = Session.get('paymentMethodForAmountSent');
    if (paymentMethodId !== undefined) {
      return paymentMethodId;
    } else {
      if (Session.equals('priceType', 'buy')) {
        var paymentMethod = PaymentMethods.findOne({currency: Session.get('baseCurrency'), canBeUsedForSending: true});
      } else {
        var paymentMethod = PaymentMethods.findOne({currency: Session.get('counterCurrency'), canBeUsedForSending: true});
      }

      if (paymentMethod) {
        Session.set('paymentMethodForAmountSent', paymentMethod._id);
        Session.set('paymentMethodForAmountSent.flatFee', paymentMethod.flatFeeForSending);
      }
    }
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
    var marketPrice = Session.get('marketPrice');
    if (marketPrice != undefined) {
      if (Session.equals('priceType', 'buy')) {
        return Session.get('amountSent') * Session.get('marketPrice');
      } else {
        return Session.get('amountReceived') * Session.get('marketPrice');
      }
    } else {
      Session.set('marketPrice', Session.get('exchangeRate'));
    }
  },
  marketValueCurrency: function () {
    var marketPriceCurrencyId = Session.get('marketPriceCurrency');
    if (marketPriceCurrencyId !== undefined) {
      return marketPriceCurrencyId;
    } else {
      Session.set('marketPriceCurrency', Session.get('counterCurrency'));
    }
  },
  marketValueCurrencies: function () {
    return Currencies.find({code: {$ne: Session.get('baseCurrency.code')}}).map(function(currency) {
      return {label: currency.code, value: currency._id};
    });
  },
  marketValueProvider: function () {
    var marketPriceProvider = Session.get('marketPriceProvider');
    if (marketPriceProvider != undefined) {
      return marketPriceProvider;
    } else {
      Session.set('marketPriceProvider', Session.get('exchangeRateProvider'));
    }
  },
  showReceipt: function () {
    if (Session.get('amountSent') > 0 && Session.get('amountReceived') > 0) {
      if (Session.get('paymentMethodForAmountReceived') && Session.get('paymentMethodForAmountSent')) {
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
    return Session.get('paymentMethodForAmountReceived.flatFee') + Session.get('paymentMethodForAmountSent.flatFee');
  },
  salesTax: function () {
    return Session.get('salesTax');
  },
  paymentMethodNameForAmountReceived: function () {
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
  memberNumber: function () {
    return Session.get('memberNumber');
  },
  memberName: function () {
    return Session.get('memberName');
  },
  memberPhoneNumber: function () {
    return Session.get('memberPhoneNumber');
  },
  memberEmail: function () {
    return Session.get('memberEmail');
  },
  showMemberForm: function () {
    return Session.get('showMemberForm');
  },
  newMemberNumber: function () {
    return Session.get('newMemberNumber');
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

      var flatFee = Session.get('paymentMethodForAmountReceived.flatFee') + Session.get('paymentMethodForAmountSent.flatFee');
      var salesTax = 0;

      if (Session.get('priceType') === 'buy') {
        if (amountReceived > flatFee + salesTax) {
          var percentageFee = Session.get('paymentMethodForAmountReceived.percentageFee') / 100;

          if (percentageFee) {
            var amountReceivedWithoutFees = (amountReceived - flatFee - salesTax - percentageFee * (flatFee + salesTax)) / (1 + percentageFee);
            var calculatedFee = amountReceived - amountReceivedWithoutFees - flatFee - salesTax;

            Session.set('amountReceivedWithoutFees', parseFloat(accounting.toFixed(amountReceivedWithoutFees, 2)));
            console.log(calculatedFee)
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

      var flatFee = Session.get('paymentMethodForAmountReceived.flatFee') + Session.get('paymentMethodForAmountSent.flatFee');
      var salesTax = 0;

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
      Session.set('paymentMethodForAmountReceived', paymentMethod._id);
      Session.set('paymentMethodForAmountReceived.name', paymentMethod.name.toLowerCase());
      Session.set('paymentMethodForAmountReceived.flatFee', paymentMethod.flatFeeForReceiving);
      Session.set('paymentMethodForAmountReceived.percentageFee', paymentMethod.percentageFeeForReceiving);

      var flatFee = paymentMethod.flatFeeForReceiving + Session.get('paymentMethodForAmountSent.flatFee');
      var salesTax = 0;
      // var salesTax = parseFloat(accounting.toFixed(flatFee * 0.05 + flatFee * 0.09975, Session.get('counterCurrency.precision')));
    } else {
      Session.set('paymentMethodForAmountReceived', null);
      Session.set('paymentMethodForAmountReceived.name', null);
      Session.set('paymentMethodForAmountReceived.flatFee', 0);

      var flatFee = 0;
      var salesTax = 0;
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
  'click #switchPriceType': function () {
    var priceType = Session.get('priceType');

    if (priceType === 'buy') {
      Session.set('priceType', 'sell');
    } else if (priceType === 'sell') {
      Session.set('priceType', 'buy');
    }

    Session.set('amountReceived', null);
    Session.set('paymentMethodForAmountReceived', undefined);

    Session.set('amountSent', null);
    Session.set('paymentMethodForAmountSent', undefined);

    Router.go('/' + Session.get('priceType') + '-' + Session.get('baseCurrency.slug') + '/' + Session.get('counterCurrency.slug'));
  },
  'change [name=paymentMethodForAmountSent]': function (event) {
    var paymentMethod = PaymentMethods.findOne(event.target.value);

    if (paymentMethod) {
      Session.set('paymentMethodForAmountSent', paymentMethod._id);
      Session.set('paymentMethodForAmountSent.flatFee', paymentMethod.flatFeeForSending);

      var flatFee = Session.get('paymentMethodForAmountReceived.flatFee') + paymentMethod.flatFeeForSending;
      var salesTax = 0;
      // var salesTax = parseFloat(accounting.toFixed(flatFee * 0.05 + flatFee * 0.09975, Session.get('counterCurrency.precision')));

      Session.set('flatFee', flatFee);
      Session.set('salesTax', salesTax);
    } else {
      Session.set('paymentMethodForAmountSent', null);
      Session.set('paymentMethodForAmountSent.flatFee', 0);

      var flatFee = Session.get('paymentMethodForAmountReceived.flatFee') + 0;
      var salesTax = 0;
    }

    var amountReceived = Session.get('amountReceived');
    var amountSent = Session.get('amountSent');

    if (amountReceived && amountSent) {
      if (Session.get('priceType') === 'buy') {
        var calculatedFee = Session.get('paymentMethodForAmountReceived.calculatedFee');
        if (calculatedFee) {
          var amountReceivedWithoutFees = amountReceived - flatFee - salesTax - calculatedFee;
        } else {
          var amountReceivedWithoutFees = amountReceived - flatFee - salesTax;
        }

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
  'change [name=marketValueCurrency]': function (event) {
    var currency = Currencies.findOne(event.target.value);
    console.log(currency)
    var companyPrice = CompanyPrices.findOne({counterCurrency: currency._id});
    var exchangeRateProvider = companyPrice.exchangeRateProvider;
    var exchangeRate = ExchangeRates.findOne({provider: exchangeRateProvider, counterCurrency: currency._id});

    Session.set('marketPrice', exchangeRate.rate);
    Session.set('marketPriceCurrency', currency._id);
    Session.set('marketPriceProvider', exchangeRateProvider.name);
  },
  'input [name=memberNumber]': function() {
    var memberNumber = parseInt(event.target.value);
    if (isNaN(memberNumber)) {
      Session.set('memberNumber', undefined);
    } else {
      Meteor.call('findMember', memberNumber, function (error, result) {
        if (error) {
          Session.set('memberNumber', undefined);
        } else {
          Session.set('memberNumber', result.number);
          Session.set('memberName', result.firstName + ' ' + result.lastName);
          Session.set('memberPhoneNumber', result.phoneNumber);
          Session.set('memberEmail', result.email);
        }
      });
    }
  },
  'click #addNewMember': function() {
    if (Session.equals('showMemberForm', false)) {
      Meteor.call('newMemberNumber', function (error, result) {
        Session.set('newMemberNumber', result);
        Session.set('showMemberForm', true);
      });
    } else {
      Session.set('showMemberForm', false);
    }
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
  },
  insertMemberForm: {
    onSuccess: function (formType, result) {
      Session.set('showMemberForm', false);
      Meteor.call('findMemberNumber', result, function (error, result) {
        Session.set('memberNumber', result);
      });
    }
  }
});
