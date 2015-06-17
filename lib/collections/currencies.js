Currencies = new orion.collection('currencies', {
  singularName: 'currency',
  tabular: {
    order: [[0, "desc"]],
    columns: [
      { data: 'name', title: 'Name' },
      { data: 'code', title: 'Code' },
      { data: 'precision', title: 'Precision' }
    ]
  }
});
