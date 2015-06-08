ExchangeRates = new orion.collection('exchange-rates', {
  singularName: 'exchange rates',
  pluralName: 'exchange rates',
  title: 'Exchange rates',
  link: {
    title: 'Exchange rates'
  },
  tabular: {
    columns: [
      { data: 'fromCurrency', title: 'From (currency)' },
      { data: 'toCurrency', title: 'To (currency)' },
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

ExchangeRates.attachSchema(new SimpleSchema({
  fromCurrency: {
    type: String,
    label: 'From (currency)',
    allowedValues: ['BTC', 'CAD', 'USD']
  },
  toCurrency: {
    type: String,
    label: 'To (currency)',
    allowedValues: ['BTC', 'CAD', 'USD']
  },
  value: {
    type: Number,
    decimal: true
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
