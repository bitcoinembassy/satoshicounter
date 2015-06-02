orion.dictionary.addDefinition('name', 'company', {
    type: String,
    defaultValue: 'Satoshi Counter',
    autoform: {
      afFieldInput: {
        placeholder: 'Satoshi Counter'
      }
    }
});

orion.dictionary.addDefinition('percentageOverAskPrice', 'company', {
    type: Number,
    label: "Percentage over Bitcoin ask price",
    autoform: {
      afFieldInput: {
        placeholder: 5
      }
    }
});

orion.dictionary.addDefinition('percentageBelowBidPrice', 'company', {
    type: Number,
    label: "Percentage below Bitcoin bid price",
    autoform: {
      afFieldInput: {
        placeholder: 5
      }
    }
});
