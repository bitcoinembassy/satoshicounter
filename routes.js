var getAfterAction = function(title) {
	return function() {
		if (!Meteor.isClient) {
			return;
		}
		var companyName = orion.dictionary.get('company.name', 'Satoshi Counter');
		SEO.set({
			title: title ? title + ' - Satoshi Counter' : companyName
		});
	}
}

Router.configure({
  layoutTemplate: 'layout'
});

Router.route('/', {
	name: 'home',
  onAfterAction: getAfterAction()
});

Router.route('/buy', {
  name: 'buy',
  onAfterAction: getAfterAction('Buy bitcoins')
});

Router.route('/sell', {
  name: 'sell',
  onAfterAction: getAfterAction('Sell bitcoins')
});


Router.route('/buy-bitcoins', {
  name: 'buy.bitcoins',
	template: 'bitcoins',
  onAfterAction: getAfterAction('Buy bitcoins')
});

Router.route('/buy-canadian-dollars', {
  name: 'buy.canadianDollars',
	template: 'canadianDollars',
  onAfterAction: getAfterAction('Buy Canadian dollars')
});

Router.route('/buy-us-dollars', {
  name: 'buy.usDollars',
	template: 'usDollars',
  onAfterAction: getAfterAction('Buy US dollars')
});

Router.onAfterAction(
  getAfterAction()
);
