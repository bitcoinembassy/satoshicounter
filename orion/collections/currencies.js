Currencies = new orion.collection('currencies', {
  singularName: 'currency',
  tabular: {
    order: [[0, "desc"]],
    columns: [
      { data: 'name', title: 'Name' },
      { data: 'code', title: 'Code' }
    ]
  }
});

Currencies.attachSchema(new SimpleSchema({
  name: {
    type: String
  },
  code: {
    type: String,
    allowedValues: ['BTC', 'CAD', 'USD'],
    unique: true,
    denyUpdate: true
  },
  exchangeRates: {
    type: [Object]
  },
  'exchangeRates.$.currencyCode': {
    type: String,
    allowedValues: ['BTC', 'CAD', 'USD']
  },
  'exchangeRates.$.value': {
    type: String
  },
  'exchangeRates.$.percentageFee': {
    type: Number,
    decimal: true
  },
  'exchangeRates.$.flatFee': {
    type: Number,
    decimal: true
  }
}));
