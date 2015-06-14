ExchangeRates.attachSchema(new SimpleSchema({
  fromCurrency: orion.attribute('hasOne', {
    label: 'From'
  }, {
    collection: Currencies,
    titleField: 'name',
    publicationName: 'exchangeRateFromCurrency'
  }),
  toCurrency: orion.attribute('hasOne', {
    label: 'To'
  }, {
    collection: Currencies,
    titleField: 'name',
    publicationName: 'exchangeRateToCurrency'
  }),
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
  },
  mainCurrency: orion.attribute('hasOne', {}, {
    collection: Currencies,
    titleField: 'name',
    publicationName: 'exchangeRateMainCurrency'
  })
}));
