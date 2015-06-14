Trades = new orion.collection('trades', {
  singularName: 'trade',
  tabular: {
    order: [[0, "desc"]],
    columns: [
      {
        data: "createdAt",
        title: "Time",
        render: function(val, type, doc) {
          return moment(val).calendar();
        }
      },
      orion.attributeColumn('hasOne', 'member', 'Member'),
      {
        data: 'fromAmount',
        title: 'From (amount)',
        render: function(val, type, doc) {
          return accounting.formatMoney(val);
        }
      },
      {
        data: 'toAmount',
        title: 'To (amount)',
          render: function(val, type, doc) {
            return accounting.formatMoney(val, { symbol: "BTC", precision: 4, format: "%v %s" });
        }
      },
      {
        data: 'marketValue',
        title: 'Market value',
        render: function(val, type, doc) {
          return accounting.formatMoney(val);
        }
      },
      { data: 'status', title: 'Status' }
    ]
  }
});
