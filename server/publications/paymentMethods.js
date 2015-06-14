Meteor.publish('paymentMethods', function() {
  return PaymentMethods.find();
});
