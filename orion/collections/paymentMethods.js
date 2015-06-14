PaymentMethods.attachSchema(new SimpleSchema({
  name: {
    type: String
  },
  currency: orion.attribute('hasOne', {}, {
    collection: Currencies,
    titleField: 'name',
    publicationName: 'paymentMethodCurrency'
  }),
  percentageFee: {
    type: Number,
    decimal: true
  },
  flatFee: {
    type: Number,
    decimal: true
  }
}));
