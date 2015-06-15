Template.registerHelper('formatNumber', function(number) {
  return accounting.formatNumber(number, Session.get('mainCurrencyPrecision'));
});

Template.registerHelper('formatMainCurrency', function (number) {
  return accounting.formatMoney(number, { symbol: Session.get('mainCurrency'), format: "%v %s", precision: Session.get('mainCurrencyPrecision') });
});

Template.registerHelper('formatMemberCurrency', function (number) {
  return accounting.formatMoney(number, { symbol: Session.get('memberCurrency'), format: "%v %s" });
});

Template.registerHelper('formatCompanyCurrency', function (number) {
  return accounting.formatMoney(number, { symbol: Session.get('companyCurrency'), format: "%v %s" });
});
