Meteor.startup(function () {
  Meteor.subscribe('currencies');
  Meteor.subscribe('exchangeRateProviders');
  Meteor.subscribe('exchangeRates');
  Meteor.subscribe('paymentMethods');

  // AutoForm.debug();
});
