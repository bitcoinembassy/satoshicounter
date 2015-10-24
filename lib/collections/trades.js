Trades = new orion.collection('trades', {
  singularName: 'trade',
  tabular: {
    order: [[7, "desc"]],
    columns: [
      { data: 'transactionIdForAmountReceived', title: 'Envelope' },
      {
        data: 'amountReceived',
        title: 'Amount received',
        render: function (val, type, doc) {
          var paymentMethod = PaymentMethods.findOne(doc.paymentMethodForAmountReceived);
          var currency = Currencies.findOne(paymentMethod.currency);
          return accounting.formatMoney(val, { symbol: currency.code, format: "%v %s"});
        }
      },
      {
        data: 'paymentMethodForAmountReceived',
        title: 'Method',
        render: function (val, type, doc) {
          return PaymentMethods.findOne(val).name;
        }
      },
      {
        data: 'amountSent',
        title: 'Amount sent',
        render: function (val, type, doc) {
          var paymentMethod = PaymentMethods.findOne(doc.paymentMethodForAmountSent);
          var currency = Currencies.findOne(paymentMethod.currency);
          return accounting.formatMoney(val, { symbol: currency.code, format: "%v %s", precision: currency.precision });
        }
      },
      {
        data: 'paymentMethodForAmountSent',
        title: 'Method',
        render: function (val, type, doc) {
          return PaymentMethods.findOne(val).name;
        }
      },
      // {
      //   data: 'marketValue',
      //   title: 'Market value',
      //   render: function(val, type, doc) {
      //     return accounting.formatMoney(val);
      //   }
      // },
      orion.attributeColumn('hasOne', 'member', 'Member'),
      orion.attributeColumn('createdBy', 'createdBy', 'Employee'),
      {
        data: "createdAt",
        title: "Time",
        render: function(val, type, doc) {
          return moment(val).format("MMMM Do, h:mm A");
        }
      }
    ]
  }
});
