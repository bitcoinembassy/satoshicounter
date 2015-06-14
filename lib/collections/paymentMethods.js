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
