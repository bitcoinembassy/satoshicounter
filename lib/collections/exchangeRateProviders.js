ExchangeRateProviders = new orion.collection('exchange-rate-providers', {
  singularName: 'exchange rate provider',
  pluralName: 'exchange rate providers',
  title: 'Exchange rate providers',
  link: {
    title: 'Exchange rate providers'
  },
  tabular: {
    columns: [
      { data: 'name', title: 'Name' },
      { data: 'baseUrl', title: 'Base URL' },
      { data: 'refreshInterval', title: 'Refresh interval' }
    ]
  }
});
