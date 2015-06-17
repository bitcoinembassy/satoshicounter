ExchangeRateProviders.attachSchema(new SimpleSchema({
  name: {
    type: String,
    unique: true
  },
  baseUrl: {
    type: String,
    label: 'Base URL'
  },
  refreshInterval: {
    type: Number,
    label: 'Refresh interval (in seconds)',
    defaultValue: 60
  }
}));
