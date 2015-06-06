orion.dictionary.addDefinition('name', 'company', {
  type: String,
  autoform: {
    afFieldInput: {
      defaultValue: 'Satoshi Counter'
    }
  }
});

orion.dictionary.addDefinition('mainCurrency', 'company', {
  type: String,
  allowedValues: ['BTC', 'CAD', 'USD'],
  autoform: {
    afFieldInput: {
      defaultValue: 'BTC'
    }
  }
});
