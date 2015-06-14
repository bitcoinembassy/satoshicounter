ExchangeRates = new orion.collection('exchange-rates', {
  singularName: 'exchange rates',
  pluralName: 'exchange rates',
  title: 'Exchange rates',
  link: {
    title: 'Exchange rates'
  },
  tabular: {
    columns: [
      orion.attributeColumn('hasOne', 'fromCurrency', 'From'),
      orion.attributeColumn('hasOne', 'toCurrency', 'To'),
      { data: 'value', title: 'Value' },
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
