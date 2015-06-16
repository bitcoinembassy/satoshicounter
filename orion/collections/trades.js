Trades.attachSchema(new SimpleSchema({
  memberAmount: {
    type: Number,
    label: 'From',
    min: 0,
    decimal: true,
    autoform: {
      placeholder: 'I have'
    }
  },
  memberPaymentMethod: {
    type: String,
    label: 'Method',
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
  companyAmount: {
    type: Number,
    label: 'To',
    min: 0,
    decimal: true,
    autoform: {
      placeholder: 'I want'
    }
  },
  companyPaymentMethod: {
    type: String,
    label: 'Method',
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
  memberNumber: {
    type: Number,
    label: 'Member',
    autoform: {
      placeholder: 'Member number'
    }
  },
  marketValue: {
    type: Number,
    optional: true,
    min: 0,
    decimal: true,
    autoform: {
      placeholder: 'Amount'
    }
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
  // marketValueCurrency: orion.attribute('hasOne', {
  //   label: 'Valued in'
  // }, {
  //   collection: Currencies,
  //   titleField: 'name',
  //   publicationName: 'marketValueCurrency'
  // }),
  memberPaymentReceived: {
    type: String,
    label: 'Member payment received',
    allowedValues: ['yes', 'no'],
    autoform: {
      type: "select-radio-inline",
      options: {
        yes: "Yes",
        no: "No"
      }
    },
    defaultValue: 'no'
  },
  companyPaymentSent: {
    type: String,
    label: 'Company payment sent',
    allowedValues: ['yes', 'no'],
    autoform: {
      type: "select-radio-inline",
      options: {
        yes: "Yes",
        no: "No"
      }
    },
    defaultValue: 'no'
  },
  // txid: {
  //   type: String,
  //   label: "txid",
  //   optional: true
  // },
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
  createdAt: orion.attribute('createdAt'),
  createdBy: orion.attribute('createdBy')
}));
