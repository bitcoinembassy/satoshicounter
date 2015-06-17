ExchangeRateProviders.find().forEach(function (provider) {
  var interval = Meteor.setInterval(function() {
    ExchangeRates.find({provider: provider._id}).forEach(function (exchangeRate) {
      var rate = HTTP.get(this + exchangeRate.endpointUrl).data[exchangeRate.jsonKey];

      ExchangeRates.update(exchangeRate._id, {$set: {rate: rate}});
    }, provider.baseUrl);
  }, provider.refreshInterval * 100);

  Meteor.setInterval(function() {
    var timeBeforeNextRefresh = Math.ceil((interval._idleStart + interval._idleTimeout - Date.now()) / 1000);

    Timers.update(
      {
        exchangeRateProvider: provider._id
      },
      {
        $set: {
          timeBeforeNextRefresh: timeBeforeNextRefresh
        }
      }
    );
  }, 5000);
});
