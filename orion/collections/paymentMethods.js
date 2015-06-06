PaymentMethods = new orion.collection('payment-methods', {
  singularName: 'payment method',
  pluralName: 'payment methods',
  title: 'Payment methods',
  link: {
    title: 'Payment methods'
  },
  tabular: {
    columns: [
      { data: 'name', title: 'Name' },
      { data: 'currencyCode', title: 'Currency' },
      {
        data: 'percentageFee',
        title: 'Percentage fee',
        render: function(val, type, doc) {
          return val + '%';
        }
      },
      {
        data: 'flatFee',
        title: 'Flat fee',
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
  currencyCode: {
    type: String,
    allowedValues: ['BTC', 'CAD', 'USD']
  },
  percentageFee: {
    type: Number,
    decimal: true
  },
  flatFee: {
    type: Number,
    decimal: true
  }
}));
