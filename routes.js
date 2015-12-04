Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading'
});

Router.route('/', function () {
  this.render('tradesCreate');
});

Router.route('/:priceType-:baseCurrency/:counterCurrency', {
  name: 'tradesCreate'
});

Router.route('/trades/:_id', {
  name: 'tradesShow'
});
