ExchangeRates.attachSchema(new SimpleSchema({
  provider: orion.attribute('hasOne', {}, {
    collection: ExchangeRateProviders,
    titleField: 'name',
    publicationName: 'exchangeRateProvider'
  }),
  baseCurrency: orion.attribute('hasOne', {}, {
    collection: Currencies,
    titleField: 'name',
    publicationName: 'exchangeRateBaseCurrency'
  }),
  counterCurrency: orion.attribute('hasOne', {}, {
    collection: Currencies,
    titleField: 'name',
    publicationName: 'exchangeRateCounterCurrency'
  }),
  endpointUrl: {
    type: String,
    label: 'Endpoint URL'
  },
  jsonKey: {
    type: String,
    label: 'JSON key'
  },
  rate: {
    type: Number,
    decimal: true
  }
}));
