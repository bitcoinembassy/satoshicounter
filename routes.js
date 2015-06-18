Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading'
});

Router.route('/', {
	name: 'home'
});

Router.route('/:priceType-:baseCurrency/:counterCurrency', {
	name: 'tradesCreate'
});
