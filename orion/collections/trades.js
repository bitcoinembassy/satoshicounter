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
      { data: 'type', title: 'Type' },
      {
        data: 'dollarAmount',
        title: 'Amount',
        render: function(val, type, doc) {
          return accounting.formatMoney(val);
        }
      },
      {
        data: 'bitcoinAmount',
        title: 'Amount',
          render: function(val, type, doc) {
            return accounting.formatMoney(val, { symbol: "BTC", precision: 4, format: "%v %s" });
        }
      },
      {
        data: 'marketValue',
        title: 'Value',
        render: function(val, type, doc) {
          return accounting.formatMoney(val);
        }
      },
      { data: 'paymentMethod', title: 'Method' },
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
    publicationName: 'members'
  }),
  type: {
    type: String,
    allowedValues: ['buy', 'sell'],
    autoform: {
      type: 'select-radio-inline',
      options: {
        buy: "Buy",
        sell: "Sell"
      }
    },
    defaultValue: 'buy'
  },
  paymentMethod: {
    type: String,
    allowedValues: ['cash', 'debit', 'credit'],
    autoform: {
      type: 'select-radio-inline',
      options: {
        cash: "Cash",
        debit: "Debit",
        credit: "Credit"
      }
    },
    defaultValue: 'cash'
  },
  dollarAmount: {
    type: Number,
    decimal: true,
    label: "Amount of dollars"
  },
  bitcoinAmount: {
    type: Number,
    decimal: true,
    autoform: {
      omit: true
    },
    autoValue: function() {
      var dollarAmount = this.field('dollarAmount');
      var type = this.field('type');
      var paymentMethod = this.field('paymentMethod');

      var cash = PaymentMethods.findOne({name: 'Cash'});
      var normalFlatFee = cash.buyPrice.flatFee;
      if (paymentMethod.value === 'cash') {
        if (type.value === 'buy') {
          var flatFee = normalFlatFee;
        }
      } else if (paymentMethod.value === 'debit') {
        var debit = PaymentMethods.findOne({name: 'Debit'});
        if (type.value === 'buy') {
          var flatFee = normalFlatFee + debit.buyPrice.flatFee;
        }
      } else if (paymentMethod.value === 'credit') {
        var credit = PaymentMethods.findOne({name: 'Credit'});
        if (type.value === 'buy') {
          var flatFee = normalFlatFee + credit.buyPrice.flatFee;
        }
      }

      var canadianDollar = Currencies.findOne({code: 'CAD'});

      if (type.value === 'buy') {
        var tax = flatFee * 0.05 + flatFee * 0.09975;
        var finalAmountDollars = dollarAmount.value - flatFee - tax;
        return finalAmountDollars / canadianDollar.buyPrice;
      }
    }
  },
  marketValue: {
    type: Number,
    decimal: true,
    autoform: {
      omit: true
    },
    autoValue: function() {
      var bitcoinAmount = this.field('bitcoinAmount');
      var canadianDollar = Currencies.findOne({code: 'CAD'});
      return bitcoinAmount.value * canadianDollar.askPrice;
    }
  },
  percentageFee: {
    type: Number,
    autoform: {
      omit: true
    },
    autoValue: function() {
      var type = this.field('type');
      var cash = PaymentMethods.findOne({name: 'Cash'});
      if (type.value === 'buy') {
        return cash.buyPrice.percentageFee;
      }
    }
  },
  flatFee: {
    type: Number,
    decimal: true,
    autoform: {
      omit: true
    },
    autoValue: function() {
      var type = this.field('type');
      var paymentMethod = this.field('paymentMethod');

      var cash = PaymentMethods.findOne({name: 'Cash'});
      var normalFlatFee = cash.buyPrice.flatFee;
      if (paymentMethod.value === 'cash') {
        if (type.value === 'buy') {
          var flatFee = normalFlatFee;
        }
      } else if (paymentMethod.value === 'debit') {
        var debit = PaymentMethods.findOne({name: 'Debit'});
        if (type.value === 'buy') {
          var flatFee = normalFlatFee + debit.buyPrice.flatFee;
        }
      } else if (paymentMethod.value === 'credit') {
        var credit = PaymentMethods.findOne({name: 'Credit'});
        if (type.value === 'buy') {
          var flatFee = normalFlatFee + credit.buyPrice.flatFee;
        }
      }

      return flatFee;
    }
  },
  paymentReceived: {
    type: String,
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
  paymentSent: {
    type: String,
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
  txid: {
    type: String,
    label: "txid",
    optional: true
  },
  status: {
    type: String,
    allowedValues: ['open', 'expired', 'close'],
    autoform: {
      type: 'select-radio-inline',
      options: {
        open: "Open",
        paid: "Close"
      }
    },
    defaultValue: 'open'
  },
  notes: {
    type: String,
    optional: true,
    autoform: {
      rows: 5
    }
  }
}));
