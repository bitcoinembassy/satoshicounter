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

Router.route('/trades/:_id', {
  name: 'tradesShow'
});
