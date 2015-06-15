Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading'
});

Router.route('/', {
	name: 'home'
});

Router.route('/:memberCurrency/:companyCurrency', {
	name: 'tradesCreate',
  waitOn: function() {
    return Meteor.subscribe('exchangeRate', this.params.memberCurrency, this.params.companyCurrency);
  }
});
