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
        title: 'Fee for buyers',
        render: function (val, type, doc) {
          return val + '%';
        }
      },
      {
        data: 'percentageFeeForSellers',
        title: 'Fee for sellers',
        render: function (val, type, doc) {
          return val + '%';
        }
      },
      {
        data: 'flatFee',
        title: 'Flat fee',
        render: function (val, type, doc) {
          return accounting.formatMoney(val);
        }
      }
    ]
  }
});
