PaymentMethods = new orion.collection('payment-methods', {
  singularName: 'payment method',
  pluralName: 'payment methods',
  link: {
    title: 'Payment methods'
  },
  tabular: {
    columns: [
      { data: 'name', title: 'Name' },
      {
        data: 'buy.percentageFee',
        title: 'Buy | Percentage fee',
        render: function(val, type, doc) {
          return val + '%';
        }
      },
      {
        data: 'buy.flatFee',
        title: 'Buy | Flat fee',
        render: function(val, type, doc) {
          return accounting.formatMoney(val);
        }
      },
      {
        data: 'sell.percentageFee',
        title: 'Sell | Percentage fee',
        render: function(val, type, doc) {
          return val + '%';
        }
      },
      {
        data: 'sell.flatFee',
        title: 'Sell | Flat fee',
        render: function(val, type, doc) {
          return accounting.formatMoney(val);
        }
      }
    ]
  }
});

PaymentMethods.attachSchema(new SimpleSchema({
  name: {
    type: String
  },
  buy: {
    type: Object
  },
  "buy.percentageFee": {
    type: Number,
    decimal: true
  },
  "buy.flatFee": {
    type: Number
  },
  sell: {
    type: Object
  },
  "sell.percentageFee": {
    type: Number,
    decimal: true
  },
  "sell.flatFee": {
    type: Number
  }
}));
