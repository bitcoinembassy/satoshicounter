Template.registerHelper('formatDollarSign', function(price) {
  return accounting.formatMoney(price);
});

Template.registerHelper('formatBTC', function(price) {
  return accounting.formatMoney(price, { precision: 4, symbol: "BTC",  format: "%v %s" });
});

Template.registerHelper('formatCAD', function(price) {
  return accounting.formatMoney(price, { symbol: "CAD",  format: "%v %s" });
});
