Currencies.attachSchema(new SimpleSchema({
  name: {
    type: String
  },
  code: {
    type: String,
    unique: true,
  },
  precision: {
    type: Number,
    defaultValue: 2
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
