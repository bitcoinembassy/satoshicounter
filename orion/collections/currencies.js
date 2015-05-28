Currencies = new orion.collection('currencies', {
  singularName: 'price',
  tabular: {
    order: [[0, "desc"]],
    columns: [
      { data: 'name', title: 'Name' },
      { data: 'code', title: 'Code' },
      {
        data: "askPrice",
        title: "Ask price",
        render: function(val, type, doc) {
          return accounting.formatMoney(val);
        }
      },
      {
        data: "bidPrice",
        title: "Bid price",
        render: function(val, type, doc) {
          return accounting.formatMoney(val);
        }
      },
      {
        data: "buyPrice",
        title: "Buy price",
        render: function(val, type, doc) {
          return accounting.formatMoney(val);
        }
      },
      {
        data: "sellPrice",
        title: "Sell price",
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
  askPrice: {
    type: Number,
    decimal: true
  },
  bidPrice: {
    type: Number,
    decimal: true
  },
  buyPrice: {
    type: Number,
    decimal: true
  },
  sellPrice: {
    type: Number,
    decimal: true
  }
}));
