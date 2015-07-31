Template.registerHelper('formatBaseCurrency', function (number) {
  return accounting.formatMoney(number, { symbol: Session.get('baseCurrency.code'), format: "%v %s", precision: Session.get('baseCurrency.precision') });
});

Template.registerHelper('formatCounterCurrency', function (number) {
  return accounting.formatMoney(number, { symbol: Session.get('counterCurrency.code'), format: "%v %s", precision: Session.get('counterCurrency.precision') });
});

Template.registerHelper('formatDate', function (date) {
  return moment(date).format("dddd, MMMM Do YYYY")
});

Template.registerHelper('formatNumber', function (number) {
  return accounting.formatNumber(number, Session.get('counterCurrency.precision'));
});
