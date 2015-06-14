Currencies = new orion.collection('currencies', {
  singularName: 'currency',
  tabular: {
    order: [[0, "desc"]],
    columns: [
      { data: 'code', title: 'Code' },
      { data: 'name', title: 'Name' },
      { data: 'pluralName', title: 'Plural name' },
      orion.attributeColumn('hasOne', 'mainPaymentMethod', 'Main payment method')
    ]
  }
});
