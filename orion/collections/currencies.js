Currencies = new orion.collection('currencies', {
  singularName: 'currency',
  tabular: {
    order: [[0, "desc"]],
    columns: [
      { data: 'name', title: 'Name' },
      { data: 'code', title: 'Code' },
      {
        data: "askPrice",
        title: "Buy | Market price",
        render: function(val, type, doc) {
          return accounting.formatMoney(val);
        }
      },
      {
        data: "buyPrice",
        title: "Buy | Company price",
        render: function(val, type, doc) {
          return accounting.formatMoney(val);
        }
      },
      {
        data: "bidPrice",
        title: "Sell | Market price",
        render: function(val, type, doc) {
          return accounting.formatMoney(val);
        }
      },
      {
        data: "sellPrice",
        title: "Sell | Company price",
        render: function(val, type, doc) {
          return accounting.formatMoney(val);
        }
      }
    ]
  }
});

Currencies.attachSchema(new SimpleSchema({
  name: {
    type: String
  },
  code: {
    type: String
  },
  buy: {
    type: Object
  },
  "buy.marketPrice": {
    type: Number,
    decimal: true
  },
  "buy.companyPrice": {
    type: Number,
    decimal: true
  },
  sell: {
    type: Object
  },
  "sell.marketPrice": {
    type: Number,
    decimal: true
  },
  "sell.companyPrice": {
    type: Number,
    decimal: true
  }
}));
