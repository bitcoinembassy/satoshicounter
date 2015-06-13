Router.configure({
  layoutTemplate: 'layout'
});

Router.route('/', {
	name: 'home'
});

Router.route('/:fromCurrency/:toCurrency', {
	name: 'currencyConverter'
});
