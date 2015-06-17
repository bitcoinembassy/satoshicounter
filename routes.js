Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading'
});

Router.route('/', {
	name: 'home'
});

Router.route('/:baseCurrency/:counterCurrency', {
	name: 'tradesCreate'
  // waitOn: function() {
  //   var baseCurrency = Currencies.findOne({code: this.params.baseCurrency.toUpperCase()});
  //   var counterCurrency = Currencies.findOne({code: this.params.counterCurrency.toUpperCase()});
  //   console.log(baseCurrency._id)
  //   console.log(counterCurrency._id)
  //   var companyPrice = CompanyPrices.findOne({baseCurrency: baseCurrency._id, counterCurrency: counterCurrency._id});
  //   console.log(companyPrice)
  //   var exchangeRate = ExchangeRates.findOne({provider: companyPrice.provider, baseCurrency: baseCurrency._id, counterCurrency: counterCurrency._id});
  //
  //   return [
  //     Meteor.subscribe('companyPrice', baseCurrency._id, counterCurrency._id),
  //     Meteor.subscribe('exchangeRate', exchangeRate._id)
  //   ];
  // }
});
