PaymentMethods.attachSchema(new SimpleSchema({
  name: {
    type: String
  },
  currency: orion.attribute('hasOne', {}, {
    collection: Currencies,
    titleField: 'name',
    publicationName: 'paymentMethodCurrency'
  }),
  canBeUsedForReceiving: {
    type: Boolean,
    label: 'Can this payment method be used to receive payments?',
    defaultValue: true
  },
  flatFeeForReceiving: {
    type: Number,
    optional: true,
    decimal: true
  },
  percentageFeeForReceiving: {
    type: Number,
    decimal: true,
    defaultValue: 0
  },
  canBeUsedForSending: {
    type: Boolean,
    label: 'Can this payment method be used to send payments?',
    defaultValue: true
  },
  flatFeeForSending: {
    type: Number,
    optional: true,
    decimal: true
  }
}));
