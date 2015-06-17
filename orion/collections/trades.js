Trades.attachSchema(new SimpleSchema({
  baseCurrency: {
    type: String
  },
  counterCurrency: {
    type: String
  },
  companyPrice: {
    type: Number,
    decimal: true
  },
  percentageFee: {
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
      return PaymentMethods.find().map(function(paymentMethod) {
        return paymentMethod._id;
      });
    },
    autoform: {
      type: 'select',
      options: function() {
        return PaymentMethods.find().map(function(paymentMethod) {
          return {label: paymentMethod.name, value: paymentMethod._id};
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
      return PaymentMethods.find().map(function(paymentMethod) {
        return paymentMethod._id;
      });
    },
    autoform: {
      type: 'select',
      options: function() {
        return PaymentMethods.find().map(function(paymentMethod) {
          return {label: paymentMethod.name, value: paymentMethod._id};
        });
      }
    }
  },
  marketValue: {
    type: Number,
    optional: true,
    min: 0,
    decimal: true
    // autoValue: function() {
    //   var memberPaymentMethod = this.field('memberPaymentMethod');
    //   var companyPaymentMethod = this.field('companyPaymentMethod');
    //   var companyAmount = this.field('companyAmount');
    //
    //   if (Meteor.isServer) {
    //     var exchangeRate = ExchangeRates.findOne({fromCurrency: fromCurrency.value, toCurrency: toCurrency.value});
    //     return companyAmount.value * exchangeRate.value;
    //   }
    // }
  },
  memberNumber: {
    type: Number
  },
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
