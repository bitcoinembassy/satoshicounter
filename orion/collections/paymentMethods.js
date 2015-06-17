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
  },
  canBeUsedForReceiving: {
    type: Boolean,
    label: 'Can this payment method be used to receive payments?',
    defaultValue: true
  },
  canBeUsedForSending: {
    type: Boolean,
    label: 'Can this payment method be used to send payments?',
    defaultValue: true
  }
}));
