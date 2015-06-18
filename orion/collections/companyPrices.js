CompanyPrices.attachSchema(new SimpleSchema({
  baseCurrency: orion.attribute('hasOne', {}, {
    collection: Currencies,
    titleField: 'name',
    publicationName: 'companyPriceBaseCurrency'
  }),
  counterCurrency: orion.attribute('hasOne', {}, {
    collection: Currencies,
    titleField: 'name',
    publicationName: 'companyPriceCounterCurrency'
  }),
  exchangeRateProvider: orion.attribute('hasOne', {
  }, {
    collection: ExchangeRateProviders,
    titleField: 'name',
    publicationName: 'companyPriceExchangeRateProvider'
  }),
  percentageFeeForBuyers: {
    type: Number,
    label: 'Percentage fee (for buyers)',
    decimal: true
  },
  percentageFeeForSellers: {
    type: Number,
    label: 'Percentage fee (for sellers)',
    decimal: true
  }
}));
