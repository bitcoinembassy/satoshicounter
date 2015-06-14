Router.configure({
  layoutTemplate: 'layout'
});

Router.route('/', {
	name: 'home'
});

Router.route('/:fromCurrency/:toCurrency', function() {
  console.log('test')
	this.render('currencyConverter');
});
