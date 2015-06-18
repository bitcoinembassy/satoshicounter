Meteor.startup(function () {
  var currencies = Meteor.subscribe('currencies');
  var paymentMethods = Meteor.subscribe('paymentMethods');

  AutoForm.debug();
});
