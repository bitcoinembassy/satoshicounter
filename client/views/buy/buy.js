Template.buy.helpers({
  companyPrice: function() {
    return Session.get('buy.companyPrice');
  },
  amountDollars: function() {
    return Session.get('buy.amountDollars');
  },
  amountBitcoins: function() {
    return Session.get('buy.amountBitcoins');
  },
  cash: function() {
    if (Session.get('buy.paymentMethod') === 'cash') {
      return "checked";
    }
  },
  debit: function() {
    if (Session.get('buy.paymentMethod') === 'debit') {
      return "checked";
    }
  },
  credit: function() {
    if (Session.get('buy.paymentMethod') === 'credit') {
      return "checked";
    }
  },
  flatFee: function() {
    return Session.get('buy.flatFee');
  },
  tax: function() {
    return Session.get('buy.flatFee') * 0.05 + Session.get('buy.flatFee') * 0.09975;
  },
  finalAmountDollars: function() {
    var flatFee = Session.get('buyPrice.flatFee');
    var tax = flatFee * 0.05 + flatFee * 0.09975;
    return Session.get('amountDollars') - flatFee - tax;
  },
  marketValueCAD: function() {
    return Session.get('amountBitcoins') * Session.get('CAD.askPrice');
  },
  marketValueUSD: function() {
    return Session.get('amountBitcoins') * Session.get('USD.askPrice');
  }
});

Template.buy.events({
  "click #cash": function(event) {
    Session.set('paymentMethod', 'cash');
    var flatFee = Session.get('cash.buyPrice.flatFee');
    Session.set('buyPrice.flatFee', flatFee);
    if ($.isNumeric(Session.get('amountBitcoins'))) {
      var tax = flatFee * 0.05 + flatFee * 0.09975;
      var finalAmountDollars = Session.get('amountDollars') - flatFee - tax;
      var amountBitcoins = finalAmountDollars / Session.get('buyPrice');
      Session.set('amountBitcoins', accounting.toFixed(amountBitcoins, 4));
    }
  },
  "click #debit": function(event) {
    Session.set('paymentMethod', 'debit');
    var debit = PaymentMethods.findOne({name: 'Debit'});
    var flatFee = Session.get('cash.buyPrice.flatFee') + Session.get('debit.buyPrice.flatFee');
    Session.set('buyPrice.flatFee', flatFee);
    if ($.isNumeric(Session.get('amountBitcoins'))) {
      var tax = flatFee * 0.05 + flatFee * 0.09975;
      var finalAmountDollars = Session.get('amountDollars') - flatFee - tax;
      var amountBitcoins = finalAmountDollars / Session.get('buyPrice');
      Session.set('amountBitcoins', accounting.toFixed(amountBitcoins, 4));
    }
  },
  "click #credit": function(event) {
    Session.set('paymentMethod', 'credit');
    var credit = PaymentMethods.findOne({name: 'Credit'});
    var flatFee = Session.get('cash.buyPrice.flatFee') + Session.get('credit.buyPrice.flatFee');
    Session.set('buyPrice.flatFee', flatFee);
    if ($.isNumeric(Session.get('amountBitcoins'))) {
      var tax = flatFee * 0.05 + flatFee * 0.09975;
      var finalAmountDollars = Session.get('amountDollars') - flatFee - tax;
      var amountBitcoins = finalAmountDollars / Session.get('buyPrice');
      Session.set('amountBitcoins', accounting.toFixed(amountBitcoins, 4));
    }
  },
  "input #amountDollars": function(event) {
    var amountDollars = event.target.value;
    if ($.isNumeric(amountDollars)) {
      Session.set("amountDollars", amountDollars);
      var flatFee = Session.get('buyPrice.flatFee');
      var tax = flatFee * 0.05 + flatFee * 0.09975;
      if (amountDollars > flatFee + tax) {
        var finalAmountDollars = amountDollars - flatFee - tax;
        var amountBitcoins = finalAmountDollars / Session.get('buyPrice');
        Session.set("amountBitcoins", accounting.toFixed(amountBitcoins, 4));
      } else {
        Session.set("amountBitcoins", 0);
      }
    } else {
      Session.set("amountDollars", NaN);
      Session.set("amountBitcoins", NaN);
    }
  },
  "input #amountBitcoins": function(event) {
    var amountBitcoins = event.target.value;
    if ($.isNumeric(amountBitcoins)) {
      Session.set("amountBitcoins", amountBitcoins);
      var flatFee = Session.get('buyPrice.flatFee');
      var tax = flatFee * 0.05 + flatFee * 0.09975;
      var amountDollars = amountBitcoins * Session.get('buyPrice') + flatFee + tax;
      if (amountDollars > flatFee + tax) {
        Session.set("amountDollars", accounting.toFixed(amountDollars, 2));
      } else {
        Session.set("amountDollars", 0);
      }
    } else {
      Session.set("amountBitcoins", NaN);
      Session.set("amountDollars", NaN);
    }
  },
  "click input": function(event) {
    $(event.target).select();
  },
  "submit .new-trade": function(event) {
    event.preventDefault();
    Trades.insert({
      member: 1001,
      type: 'buy',
      paymentMethod: Session.get('buy.paymentMethod'),
      amountDollars: Session.get('amountDollars')
    });
    Router.go('/');
  }
});
