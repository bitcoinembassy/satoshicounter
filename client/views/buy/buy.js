Template.buy.helpers({
  buyPrice: function() {
    return Session.get('buyPrice');
  },
  amountDollars: function() {
    return Session.get('amountDollars');
  },
  amountBitcoins: function() {
    return Session.get('amountBitcoins');
  },
  placeholderBitcoins: function() {
    return accounting.toFixed((100 - orion.dictionary.get('buy.flatFee')) / Session.get('buyPrice'), 4);
  },
  marketValue: function() {
    return Session.get('amountBitcoins') * Session.get('currentPrice');
  },
  flatFee: function() {
    return Session.get('flatFee');
  }
});

Template.buy.events({
  "input #amountDollars": function (event) {
    var amountDollars = event.target.value;
    if ($.isNumeric(amountDollars)) {
      Session.set("amountDollars", amountDollars);
      if (amountDollars > orion.dictionary.get('buy.flatFee')) {
        var amountBitcoins = (amountDollars - orion.dictionary.get('buy.flatFee')) / Session.get('buyPrice');
        Session.set("amountBitcoins", accounting.toFixed(amountBitcoins, 4));
      } else {
        Session.set("amountBitcoins", 0);
      }
    } else {
      Session.set("amountDollars", NaN);
      Session.set("amountBitcoins", NaN);
    }
  },
  "input #amountBitcoins": function (event) {
    var amountBitcoins = event.target.value;
    if ($.isNumeric(amountBitcoins)) {
      Session.set("amountBitcoins", amountBitcoins);
      var amountDollars = amountBitcoins * Session.get('buyPrice') + orion.dictionary.get('buy.flatFee');
      if (amountDollars > orion.dictionary.get('buy.flatFee')) {
        Session.set("amountDollars", accounting.toFixed(amountDollars, 2));
      } else {
        Session.set("amountDollars", 0);
      }
    } else {
      Session.set("amountBitcoins", NaN);
      Session.set("amountDollars", NaN);
    }
  },
  "click input": function (event) {
    $(event.target).select();
  },
  "submit .new-trade": function (event) {
    event.preventDefault();
    Trades.insert({
      client: Meteor.userId(),
      type: 'buy',
      price: Session.get('buyPrice'),
      amount: Session.get('buyAmountCAD'),
      total: Session.get('buyAmountBTC'),
      status: 'open',
      address: Meteor.user().profile.address,
      coinbase_cad: Session.get('coinbase_price'),
      fee: orion.dictionary.get('buy.fee')
    });
    Router.go('/');
  }
});
