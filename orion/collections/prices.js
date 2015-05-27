Prices = new orion.collection('prices', {
  singularName: 'price',
  tabular: {
    order: [[0, "desc"]],
    columns: [
      {
        data: "createdAt",
        title: "Time",
        render: function(date) {
          return moment(date).calendar();
        }
      },
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

Prices.attachSchema(new SimpleSchema({
  createdAt: orion.attribute('createdAt'),
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
