Meteor.methods({
  newMemberNumber: function () {
    var highestMember = Members.findOne({}, {sort: {number: -1}});
    return highestMember.number + 1;
  },
  findMemberById: function (memberId) {
    var member = Members.findOne(memberId);
    return member;
  },
  findMemberByName: function (memberNumber) {
    var member = Members.findOne({number: memberNumber});
    if (member) {
      return member;
    } else {
      throw new Meteor.Error('member-not-found', "Invalid number");
    }
  },
  sendSMS: function (tradeId) {
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    var client = new Twilio({
      from: Meteor.settings.TWILIO.FROM,
      sid: Meteor.settings.TWILIO.SID,
      token: Meteor.settings.TWILIO.TOKEN
    });

    var trade = Trades.findOne(tradeId);
    var member = Members.findOne(trade.member);

    var PNF = LibPhoneNumber.PhoneNumberFormat;
    var phoneUtil = LibPhoneNumber.PhoneNumberUtil.getInstance();

    var phoneNumber = phoneUtil.parse(member.phoneNumber, 'CA');
    var formattedPhoneNumber = phoneUtil.format(phoneNumber, PNF.E164);

    console.log(formattedPhoneNumber);

    var receiptUrl = Meteor.absoluteUrl('trades/' + tradeId);

    console.log(receiptUrl);

    try {
      client.sendSMS({
        to: formattedPhoneNumber,
        body: "Thanks for dealing with Satoshi Counter. Here is a link to your receipt: " + receiptUrl
      });
    } catch (error) {
      throw new Meteor.Error(error.code, error.message, error.moreInfo);
    }
  },
  sendEmail: function (tradeId) {
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    var trade = Trades.findOne(tradeId);
    var member = Members.findOne(trade.member);

    var receiptUrl = Meteor.absoluteUrl('trades/' + tradeId);

    Email.send({
      to: member.firstName + member.lastName + "<" + member.email + ">",
      from: "Satoshi Counter <info@satoshicounter.com>",
      subject: "Receipt from Satoshi Counter",
      text: "Thanks for dealing with Satoshi Counter. Here is a link to your receipt: " + receiptUrl
    });
  },
  newTradeNotification: function (tradeId) {
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    var trade = Trades.findOne(tradeId);

    var baseCurrency = Currencies.findOne(trade.baseCurrency);
    var counterCurrency = Currencies.findOne(trade.counterCurrency);
    var exchangeRateProvider = ExchangeRateProviders.findOne(trade.exchangeRateProvider);
    var paymentMethodForAmountReceived = PaymentMethods.findOne(trade.paymentMethodForAmountReceived);
    var paymentMethodForAmountSent = PaymentMethods.findOne(trade.paymentMethodForAmountSent);
    var marketValueCurrency = Currencies.findOne(trade.marketValueCurrency);
    var member = Members.findOne(trade.member);
    var employee = Meteor.users.findOne(trade.createdBy);
    var envelope = trade.transactionIdForAmountReceived || "not specified";

    Email.send({
      to: "frabrunelle@gmail.com",
      from: "Satoshi Counter <info@satoshicounter.com>",
      subject: "[Satoshi Counter] New trade notification",
      text: "Price type: " + trade.priceType + "\n" +
            "Base currency: " + baseCurrency.code + "\n" +
            "Counter currency: " + counterCurrency.code + "\n" +
            "Exchange rate provider: " + exchangeRateProvider.name + "\n" +
            "Exchange rate: " + trade.exchangeRate + "\n" +
            "Percentage fee: " + trade.percentageFee + "\n" +
            "Company price: " + trade.companyPrice + "\n" +
            "Amount received: " + trade.amountReceived + "\n" +
            "Payment method (for amount received): " + paymentMethodForAmountReceived.name + "\n" +
            "Amount sent: " + trade.amountSent + "\n" +
            "Payment method (for amount sent): " + paymentMethodForAmountSent.name + "\n" +
            "Market value: " + trade.marketValue + "\n" +
            "Market value currency: " + marketValueCurrency.code + "\n" +
            "Subtotal: " + trade.subtotal + "\n" +
            "Flat fee: " + trade.flatFee + "\n" +
            "Percentage fee (for amount received): " + trade.percentageFeeForAmountReceived + "\n" +
            "Calculated fee (for amount received): " + trade.calculatedFeeForAmountReceived + "\n" +
            "Member: " + member.number + "\n" +
            "Created at: " + trade.createdAt + "\n" +
            "Created by: " + employee.profile.name + "\n" +
            "Envelope: " + envelope + "\n" +
            "Bitcoin address: " + trade.bitcoinAddress
    });

    return tradeId;
  }
});
