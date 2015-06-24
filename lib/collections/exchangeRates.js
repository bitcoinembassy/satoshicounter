ExchangeRates = new orion.collection('exchange-rates', {
  singularName: 'exchange rate',
  pluralName: 'exchange rates',
  title: 'Exchange rates',
  link: {
    title: 'Exchange rates'
  },
  tabular: {
    columns: [
      orion.attributeColumn('hasOne', 'provider', 'Provider'),
      orion.attributeColumn('hasOne', 'baseCurrency', 'Base currency'),
      orion.attributeColumn('hasOne', 'counterCurrency', 'Counter currency'),
      { data: 'endpointUrl', title: 'Endpoint URL' },
      { data: 'jsonKey', title: 'JSON key' },
      { data: 'rate', title: 'Rate' },
      {
        data: 'updatedAt',
        title: 'Updated',
        render: function(val, type, doc) {
          return moment(val).fromNow();
        }
      }
    ]
  }
});
