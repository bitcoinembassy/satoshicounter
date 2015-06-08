Currencies = new orion.collection('currencies', {
  singularName: 'currency',
  tabular: {
    order: [[0, "desc"]],
    columns: [
      { data: 'code', title: 'Code' },
      { data: 'name', title: 'Name' },
      { data: 'pluralName', title: 'Plural name' }
    ]
  }
});

Currencies.attachSchema(new SimpleSchema({
  code: {
    type: String,
    allowedValues: ['BTC', 'CAD', 'USD'],
    unique: true,
    denyUpdate: true
  },
  name: {
    type: String
  },
  pluralName: {
    type: String
  }
}));
