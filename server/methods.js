Meteor.methods({
  findMember: function (memberNumber) {
    var member = Members.findOne({number: memberNumber});
    if (member) {
      return true;
    } else {
      throw new Meteor.Error('member-not-found', "Invalid number");
    }
  },
  findMemberNumber: function (memberId) {
    var member = Members.findOne(memberId);
    return member.number;
  }
});
