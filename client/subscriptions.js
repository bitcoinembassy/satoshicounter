Meteor.startup(function () {
  Meteor.subscribe('currencies');
  Meteor.subscribe('exchangeRateProviders');
  Meteor.subscribe('exchangeRates');
  Meteor.subscribe('paymentMethods');

  Meteor.subscribe('members');

  AutoForm.debug();

  moment.locale('en', {
    calendar : {
        lastDay : '[Yesterday at] LT',
        sameDay : '[Today at] LT',
        nextDay : '[Tomorrow at] LT',
        lastWeek : '[last] dddd [at] LT',
        nextWeek : 'dddd [at] LT',
        sameElse : 'L [at] LT'
    }
  });
});
