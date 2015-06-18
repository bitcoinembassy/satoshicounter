CompanyPrices = new orion.collection('company-prices', {
  singularName: 'company price',
  pluralName: 'company prices',
  title: 'Company prices',
  link: {
    title: 'Company prices'
  },
  tabular: {
    columns: [
      orion.attributeColumn('hasOne', 'baseCurrency', 'Base currency'),
      orion.attributeColumn('hasOne', 'counterCurrency', 'Counter currency'),
      orion.attributeColumn('hasOne', 'exchangeRateProvider', 'Exchange rate provider'),
      {
        data: 'percentageFeeForBuyers',
        title: 'Percentage fee (for buyers)',
        render: function (val, type, doc) {
          return val + '%';
        }
      },
      {
        data: 'percentageFeeForSellers',
        title: 'Percentage fee (for sellers)',
        render: function (val, type, doc) {
          return val + '%';
        }
      }
    ]
  }
});
