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
      orion.attributeColumn('hasOne', 'currency', 'Currency'),
      {
        data: 'flatFeeForReceiving',
        title: 'Flat fee (for receiving)',
        render: function(val, type, doc) {
          return accounting.formatMoney(val);
        }
      },
      {
        data: 'percentageFeeForReceiving',
        title: 'Percentage fee (for receiving)',
        render: function(val, type, doc) {
          return val + '%';
        }
      },
      {
        data: 'flatFeeForSending',
        title: 'Flat fee (for sending)',
        render: function(val, type, doc) {
          return accounting.formatMoney(val);
        }
      }
    ]
  }
});
