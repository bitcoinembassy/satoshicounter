Template.tradesShow.onCreated(function () {
  var tradeId = Router.current().params._id;
  var tradeSubscription = this.subscribe('trade', tradeId);

  this.autorun(function () {
    if (tradeSubscription.ready()) {
      var trade = Trades.findOne(tradeId);
      Session.set('tradeId', trade._id);
      Session.set('member', trade.member);
      Session.set('priceType', trade.priceType);

      var baseCurrency = Currencies.findOne(trade.baseCurrency);
      Session.set('baseCurrency.code', baseCurrency.code);
      Session.set('baseCurrency.precision', baseCurrency.precision);

      var counterCurrency = Currencies.findOne(trade.counterCurrency);
      Session.set('counterCurrency.code', counterCurrency.code);
      Session.set('counterCurrency.precision', counterCurrency.precision);

      var paymentMethod = PaymentMethods.findOne(trade.paymentMethodForAmountReceived);
      Session.set('paymentMethodForAmountReceived.name', paymentMethod.name.toLowerCase());

      Session.set('bitcoinAddress', trade.bitcoinAddress);

      Session.set('amountSent', trade.amountSent.toString());
      Session.set('amountReceived', trade.amountReceived.toString());
    }
  });
});

Template.tradesShow.helpers({
  member: function () {
    return Members.findOne(Session.get('member'));
  },
  trade: function () {
    return Trades.findOne(Router.current().params._id);
  },
  buyPrice: function () {
    if (Session.equals('priceType', 'buy')) {
      return true;
    }
  },
  paymentMethodNameForAmountReceived: function () {
    return Session.get('paymentMethodForAmountReceived.name');
  },
  bitcoinAddress: function () {
    return Session.get('bitcoinAddress');
  },
  bitcoinURI: function () {
    var amount;
    if (Session.equals('priceType', 'buy')) {
      amount = Session.get('amountSent');
    } else {
      amount = Session.get('amountReceived');
    }

    return "bitcoin:" + Session.get('bitcoinAddress') + "?amount=" + amount + "&label=" + Session.get('tradeId');
  }
});

Template.tradesShow.events({
  'click #sendSMS': function () {
    $('#sendSMS').attr('disabled', 'disabled');
    Meteor.call('sendSMS', Session.get('tradeId'), function (error) {
      if (error) {
        $('#sendSMS').toggleClass('btn-default btn-danger');
        $('#sendSMS').removeAttr('disabled');
        console.log(error.reason);
        console.log(error.details);
      } else {
        $('#sendSMS').toggleClass('btn-default btn-success');
        $('#sendSMS').removeAttr('disabled');
        console.log("The SMS was successfully sent.")
      }
    });
  },
  'click #sendEmail': function () {
    $('#sendEmail').attr('disabled', 'disabled');
    Meteor.call('sendEmail', Session.get('tradeId'), function (error) {
      if (error) {
        $('#sendEmail').toggleClass('btn-default btn-danger');
        $('#sendEmail').removeAttr('disabled');
        console.log(error.reason);
        console.log(error.details);
      } else {
        $('#sendEmail').toggleClass('btn-default btn-success');
        $('#sendEmail').removeAttr('disabled');
        console.log("The Email was successfully sent.")
      }
    });
  }
});

Template.qrcode.onRendered(function () {
  this.$('div.qrcode').qrcode({
    size: this.data.size,
    text: this.data.text
  });
});
