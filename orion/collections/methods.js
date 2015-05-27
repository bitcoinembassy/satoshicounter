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
        data: 'buyPrice.percentageFee',
        title: 'Buy percentage',
        render: function(val, type, doc) {
          return val + '%';
        }
      },
      {
        data: 'buyPrice.flatFee',
        title: 'Buy fee',
        render: function(val, type, doc) {
          return accounting.formatMoney(val);
        }
      },
      {
        data: 'sellPrice.percentageFee',
        title: 'Sell percentage',
        render: function(val, type, doc) {
          return val + '%';
        }
      },
      {
        data: 'sellPrice.flatFee',
        title: 'Sell fee',
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
  buyPrice: {
    type: Object
  },
  "buyPrice.percentageFee": {
    type: Number,
    decimal: true
  },
  "buyPrice.flatFee": {
    type: Number
  },
  sellPrice: {
    type: Object
  },
  "sellPrice.percentageFee": {
    type: Number,
    decimal: true
  },
  "sellPrice.flatFee": {
    type: Number
  }
}));
