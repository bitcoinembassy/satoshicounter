Router.route('/download-trades', function() {
  var data = Trades.find({}, {sort: {createdAt: -1}}).fetch();
  var fields = [
    {
      key: 'priceType',
      title: 'Price type'
    },
    // {
    //   key: 'exchangeRateProvider',
    //   title: 'Exchange rate provider',
    //   transform: function (val) {
    //     return ExchangeRateProviders.findOne(val).name;
    //   }
    // },
    {
      key: 'exchangeRate',
      title: 'Exchange rate',
      type: 'number'
    },
    {
      key: 'percentageFee',
      title: 'Base fee (%)',
      type: 'number'
    },
    {
      key: 'companyPrice',
      title: 'Company price',
      type: 'number'
    },
    {
      key: 'subtotal',
      title: 'Subtotal',
      type: 'number'
    },
    {
      key: 'flatFee',
      title: 'Flat fee',
      type: 'number'
    },
    {
      key: 'percentageFeeForAmountReceived',
      title: 'Payment method fee (%)',
      type: 'number'
    },
    {
      key: 'calculatedFeeForAmountReceived',
      title: 'Calculated fee',
      type: 'number'
    },
    {
      key: 'amountReceived',
      title: 'Amount received',
      type: 'number'
    },
    {
      key: 'paymentMethodForAmountReceived',
      title: 'Payment method',
      transform: function (val) {
        var paymentMethod = PaymentMethods.findOne(val);
        var currency = Currencies.findOne(paymentMethod.currency);
        return paymentMethod.name + ' (' + currency.code + ')';
      }
    },
    {
      key: 'amountSent',
      title: 'Amount sent',
      type: 'number'
    },
    {
      key: 'paymentMethodForAmountSent',
      title: 'Payment method',
      transform: function (val) {
        var paymentMethod = PaymentMethods.findOne(val);
        var currency = Currencies.findOne(paymentMethod.currency);
        return paymentMethod.name + ' (' + currency.code + ')';
      }
    },
    {
      key: 'marketValue',
      title: 'Market value',
      type: 'number'
    },
    {
      key: 'marketValueCurrency',
      title: 'Market value currency',
      transform: function (val) {
        return Currencies.findOne(val).code;
      }
    },
    {
      key: 'member',
      title: 'Member number',
      type: 'number',
      transform: function (val) {
        return Members.findOne(val).number;
      }
    },
    {
      key: 'createdBy',
      title: 'Employee',
      transform: function (val) {
        return Meteor.users.findOne(val).profile.name;
      }
    },
    {
      key: 'createdAt',
      title: 'Date',
      transform: function (val) {
        return moment(val).format('M/D/YYYY HH:mm:ss');
      }
    }
  ];

  var title = 'Trades';
  var file = Excel.export(title, fields, data);
  var headers = {
    'Content-type': 'application/vnd.openxmlformats',
    'Content-Disposition': 'attachment; filename=' + title + '.xlsx'
  };

  this.response.writeHead(200, headers);
  this.response.end(file, 'binary');
}, { where: 'server' });
