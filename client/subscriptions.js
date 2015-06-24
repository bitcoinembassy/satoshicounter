Meteor.startup(function () {
  Meteor.subscribe('currencies');
  Meteor.subscribe('paymentMethods');

  AutoForm.debug();
});
