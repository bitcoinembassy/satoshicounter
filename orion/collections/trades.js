Trades.attachSchema(new SimpleSchema({
  priceType: {
    type: String,
    allowedValues: ['buy', 'sell'],
    autoform: {
      type: 'select-radio-inline',
      options: {
        buy: 'Buy',
        sell: 'Sell'
      }
    },
    defaultValue: 'buy'
  },
  baseCurrency: orion.attribute('hasOne', {}, {
    collection: Currencies,
    titleField: 'name',
    publicationName: 'tradeBaseCurrency'
  }),
  counterCurrency: orion.attribute('hasOne', {}, {
    collection: Currencies,
    titleField: 'name',
    publicationName: 'tradeCounterCurrency'
  }),
  exchangeRateProvider: orion.attribute('hasOne', {}, {
    collection: ExchangeRateProviders,
    titleField: 'name',
    publicationName: 'tradeExchangeRateProvider'
  }),
  exchangeRate: {
    type: Number,
    decimal: true
  },
  percentageFee: {
    type: Number,
    decimal: true
  },
  companyPrice: {
    type: Number,
    decimal: true
  },
  amountReceived: {
    type: Number,
    min: 0,
    decimal: true
  },
  paymentMethodForAmountReceived: {
    type: String,
    label: 'Payment method (for amount received)',
    allowedValues: function() {
      return PaymentMethods.find({canBeUsedForReceiving: true}).map(function(paymentMethod) {
        return paymentMethod._id;
      });
    },
    autoform: {
      type: 'select',
      options: function() {
        return PaymentMethods.find({canBeUsedForReceiving: true}).map(function(paymentMethod) {
          var currency = Currencies.findOne(paymentMethod.currency);
          return {label: currency.code + ' - ' + paymentMethod.name, value: paymentMethod._id};
        });
      }
    }
  },
  amountSent: {
    type: Number,
    min: 0,
    decimal: true
  },
  paymentMethodForAmountSent: {
    type: String,
    label: 'Payment method (for amount sent)',
    allowedValues: function() {
      return PaymentMethods.find({canBeUsedForSending: true}).map(function(paymentMethod) {
        return paymentMethod._id;
      });
    },
    autoform: {
      type: 'select',
      options: function() {
        return PaymentMethods.find({canBeUsedForSending: true}).map(function(paymentMethod) {
          var currency = Currencies.findOne(paymentMethod.currency);
          return {label: currency.code + ' - ' + paymentMethod.name, value: paymentMethod._id};
        });
      }
    }
  },
  marketValue: {
    type: Number,
    min: 0,
    decimal: true
  },
  marketValueCurrency: {
    type: 'String',
    allowedValues: function() {
      return Currencies.find().map(function(currency) {
        return currency._id;
      });
    },
    autoform: {
      type: 'select',
      options: function() {
        return Currencies.find().map(function(currency) {
          return {label: currency.name, value: currency._id};
        });
      }
    }
  },
  subtotal: {
    type: Number,
    decimal: true
  },
  flatFee: {
    type: Number,
    decimal: true
  },
  percentageFeeForAmountReceived: {
    type: Number,
    decimal: true,
    defaultValue: 0
  },
  calculatedFeeForAmountReceived: {
    type: Number,
    decimal: true,
    defaultValue: 0
  },
  member: orion.attribute('hasOne', {}, {
    collection: Members,
    titleField: 'number',
    publicationName: 'tradeMember'
  }),
  createdAt: orion.attribute('createdAt'),
  createdBy: orion.attribute('createdBy'),
  // transactionReceived: {
  //   type: Boolean,
  //   optional: true
  // },
  transactionIdForAmountReceived: {
    type: String,
    label: 'Transaction ID (for amount received)',
    optional: true
  },
  // transactionSent: {
  //   type: Boolean,
  //   optional: true
  // },
  transactionIdForAmountSent: {
    type: String,
    label: 'Transaction ID (for amount sent)',
    optional: true
  },
  bitcoinAddressForAmountSent: {
    type: String,
    label: 'Bitcoin address',
    optional: true,
    custom: function () {
      if (Meteor.isServer) {
        if (this.value === undefined) {
          return true;
        }

        if (BitcoinAddress.validate(this.value)) {
          return true;
        } else {
          return 'invalid Bitcoin address'
        }
      } else {
        return true;
      }
    }
  },
  notes: {
    type: String,
    optional: true,
    autoform: {
      rows: 5
    }
  },
  // status: {
  //   type: String,
  //   allowedValues: ['open', 'expired', 'close'],
  //   autoform: {
  //     type: 'select-radio-inline',
  //     options: {
  //       open: "Open",
  //       paid: "Close"
  //     }
  //   },
  //   defaultValue: 'open'
  // },
}));
