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
  }
});
