Currencies = new orion.collection('currencies', {
  singularName: 'currency',
  tabular: {
    order: [[0, "desc"]],
    columns: [
      { data: 'name', title: 'Name' },
      { data: 'code', title: 'Code' },
      { data: 'denomination', title: 'Denomination' },
      { data: 'slug', title: 'Slug' },
      { data: 'precision', title: 'Precision' }
    ]
  }
});
