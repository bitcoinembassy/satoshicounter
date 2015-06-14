Currencies.attachSchema(new SimpleSchema({
  name: {
    type: String
  },
  code: {
    type: String,
    unique: true,
  },
  pluralName: {
    type: String
  },
  mainPaymentMethod: orion.attribute('hasOne', {
    optional: true
  }, {
    collection: PaymentMethods,
    titleField: 'name',
    publicationName: 'mainPaymentMethod'
  })
}));
