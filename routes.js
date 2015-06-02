var getAfterAction = function(title) {
	return function() {
		if (!Meteor.isClient) {
			return;
		}
		var companyName = orion.dictionary.get('company.name', 'Satoshi Square');
		SEO.set({
			title: title ? title + ' - Satoshi Square' : companyName
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

Router.route('/buy-bitcoins', {
  name: 'buy',
  onAfterAction: getAfterAction('Buy bitcoins')
});

Router.route('/sell-bitcoins', {
  name: 'sell',
  onAfterAction: getAfterAction('Sell bitcoins')
});

Router.onAfterAction(
  getAfterAction()
);
