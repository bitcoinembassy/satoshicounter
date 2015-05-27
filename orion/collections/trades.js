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
        data: 'amountDollars',
        title: 'Amount',
        render: function(val, type, doc) {
          return accounting.formatMoney(val);
        }
      },
      {
        data: 'amountBitcoins',
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
    label: 'Member'
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
  amountDollars: {
    type: Number,
    decimal: true,
    label: "Amount of dollars"
  },
  amountBitcoins: {
    type: Number,
    decimal: true,
    autoform: {
      omit: true
    },
    autoValue: function() {
      var amountDollars = this.field('amountDollars');
      var currentPrice = Prices.findOne({}, {sort: {createdAt: -1}});
      if (currentPrice.bitpay > currentPrice.coinbase) {
        currentPrice = currentPrice.bitpay;
      } else {
        currentPrice = currentPrice.coinbase;
      }
      var type = this.field('type');
      if (type.value === 'buy') {
        var buyPrice = currentPrice * (1 + orion.dictionary.get('buy.percentageFee') / 100);
        return (amountDollars.value - orion.dictionary.get('buy.flatFee')) / buyPrice;
      } else if (type.value === 'sell') {
        var sellPrice = currentPrice * (1 + orion.dictionary.get('sell.percentageFee') / 100);
        return (amountDollars.value + orion.dictionary.get('sell.flatFee')) / sellPrice;
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
      var amountBitcoins = this.field('amountBitcoins');
      var currentPrice = Prices.findOne({}, {sort: {createdAt: -1}});
      if (currentPrice.bitpay > currentPrice.coinbase) {
        currentPrice = currentPrice.bitpay;
      } else {
        currentPrice = currentPrice.coinbase;
      }
      return amountBitcoins.value * currentPrice;
    }
  },
  percentageFee: {
    type: Number,
    autoform: {
      omit: true
    },
    autoValue: function() {
      var type = this.field('type');
      if (type.value === 'buy') {
        return orion.dictionary.get('buy.percentageFee');
      } else if (type.value === 'sell') {
        return orion.dictionary.get('sell.percentageFee');
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
      if (type.value === 'buy') {
        return orion.dictionary.get('buy.flatFee');
      } else if (type.value === 'sell') {
        return orion.dictionary.get('sell.flatFee');
      }
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
