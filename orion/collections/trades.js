Trades = new orion.collection('trades', {
  singularName: 'trade',
  tabular: {
    order: [[0, "desc"]],
    columns: [
      {
        data: "createdAt",
        title: "Time",
        render: function(val, type, doc) {
          return moment(val).calendar();
        }
      },
      orion.attributeColumn('hasOne', 'member', 'Member'),
      {
        data: 'fromAmount',
        title: 'From (amount)',
        render: function(val, type, doc) {
          return accounting.formatMoney(val);
        }
      },
      {
        data: 'toAmount',
        title: 'To (amount)',
          render: function(val, type, doc) {
            return accounting.formatMoney(val, { symbol: "BTC", precision: 4, format: "%v %s" });
        }
      },
      {
        data: 'marketValue',
        title: 'Market value',
        render: function(val, type, doc) {
          return accounting.formatMoney(val);
        }
      },
      { data: 'status', title: 'Status' }
    ]
  }
});

Trades.attachSchema(new SimpleSchema({
  createdAt: orion.attribute('createdAt'),
  member: orion.attribute('hasOne', {
    label: 'Member number'
  }, {
    collection: Members,
    titleField: 'number',
    publicationName: 'memberNumbers'
  }),
  fromAmount: {
    type: Number,
    label: 'From (amount)',
    min: 5,
    decimal: true
  },
  fromCurrency: {
    type: String,
    label: 'From (currency)',
    allowedValues: ['BTC', 'CAD', 'USD'],
    defaultValue: 'CAD'
  },
  toCurrency: {
    type: String,
    label: 'To (currency)',
    allowedValues: ['BTC', 'CAD', 'USD'],
    defaultValue: 'BTC'
  },
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
  memberPaymentMethod: {
    type: String,
    allowedValues: ['Cash', 'Debit card', 'Credit card'],
    autoform: {
      type: 'select-radio',
      template: 'buttonGroup',
      label: false,
      // options: function() {
      //   var fromCurrency = AutoForm.getFieldValue('fromCurrency');
      //   return PaymentMethods.find({currencyCode: fromCurrency}, {sort: {name: 1}}).map(function(obj) {
      //     return {label: obj.name, value: obj.name};
      //   });
      // }
      // options: {
      //   yes: "Yes",
      //   no: "No"
      // }
    },
    defaultValue: 'Cash'
  },
  toAmount: {
    type: Number,
    label: 'To (amount)',
    optional: true,
    min: 0,
    decimal: true,
    autoform: {
      omit: true
    },
    autoValue: function() {
      var fromAmount = this.field('fromAmount');
      var fromCurrency = this.field('fromCurrency');
      var toCurrency = this.field('toCurrency');
      var memberPaymentMethod = this.field('memberPaymentMethod');

      if (Meteor.isServer) {
        var paymentMethod = PaymentMethods.findOne({name: memberPaymentMethod.value});
        var paymentMethodFees = fromAmount.value * (paymentMethod.percentageFee / 100) + paymentMethod.flatFee;

        var exchangeRate = ExchangeRates.findOne({fromCurrency: fromCurrency.value, toCurrency: toCurrency.value});
        var fees = paymentMethodFees + exchangeRate.flatFee;
        var tax = fees * 0.05 + fees * 0.09975;

        var companyPrice = exchangeRate.value * (1 + exchangeRate.percentageFee / 100);

        return (fromAmount.value - fees - tax) / companyPrice;
      }
    }
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
  companyPaymentMethod: {
    type: String,
    allowedValues: ['Bitcoin address'],
    autoform: {
      type: 'select-radio',
      template: 'buttonGroup',
      label: false
      // label: false,
      // options: function() {
      //   var fromCurrency = AutoForm.getFieldValue('fromCurrency');
      //   return PaymentMethods.find({currencyCode: fromCurrency}, {sort: {name: 1}}).map(function(obj) {
      //     return {label: obj.name, value: obj.name};
      //   });
      // }
      // options: {
      //   yes: "Yes",
      //   no: "No"
      // }
    },
    defaultValue: 'Bitcoin address'
  },
  marketValue: {
    type: Number,
    optional: true,
    min: 0,
    decimal: true,
    autoform: {
      omit: true
    },
    autoValue: function() {
      var fromCurrency = this.field('fromCurrency');
      var toCurrency = this.field('toCurrency');
      var toAmount = this.field('toAmount');


      if (Meteor.isServer) {
        var exchangeRate = ExchangeRates.findOne({fromCurrency: fromCurrency.value, toCurrency: toCurrency.value});
        return toAmount.value * exchangeRate.value;
      }
    }
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
  status: {
    type: String,
    allowedValues: ['open', 'expired', 'close'],
    autoform: {
      type: 'select-radio-inline',
      options: {
        open: "Open",
        paid: "Close"
      },
      omit: true
    },
    defaultValue: 'open'
  }
}));
