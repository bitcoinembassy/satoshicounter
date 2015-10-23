Migrations.add('rename-to-bitcoinAddress', function () {
  var noValidate = {
    validate: false,
    filter: false,
    autoConvert: false,
    removeEmptyStrings: false,
    getAutoValues: false,
    multi: true
  };

  Trades.update({bitcoinAddressForAmountSent: {$exists: true}}, {
    $rename: {bitcoinAddressForAmountSent: 'bitcoinAddress'}
  }, noValidate);
});
