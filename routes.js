var getAfterAction = function(title) {
	return function() {
		if (!Meteor.isClient) {
			return;
		}
		SEO.set({
			title: title ? title + ' - Satoshi Square' : 'Satoshi Square'
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
