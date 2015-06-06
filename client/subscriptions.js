// var paymentMethods = Meteor.subscribe('paymentMethods');
//
// Tracker.autorun(function () {
//   if (paymentMethods.ready()) {
//     var cash = PaymentMethods.findOne({name: 'Cash'});
//     Session.set('cash.buy.flatFee', cash.buy.flatFee);
//
//     var debit = PaymentMethods.findOne({name: 'Debit card'});
//     Session.set('debit.buy.flatFee', debit.buy.flatFee);
//
//     var credit = PaymentMethods.findOne({name: 'Credit card'});
//     Session.set('credit.buy.flatFee', credit.buy.flatFee);
//
//     Session.set('buy.percentageFee', 1.07);
//     Session.set('buy.flatFee', cash.buy.flatFee);
//     Session.set('buy.btc.paymentMethod', 'cash');
//   }
// });
