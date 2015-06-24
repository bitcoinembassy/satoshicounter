Meteor.methods({
  findMember: function (memberNumber) {
    var member = Members.findOne({number: memberNumber});
    if (member) {
      return member;
    } else {
      throw new Meteor.Error('member-not-found', "Invalid number");
    }
  },
  newMemberNumber: function () {
    var highestMember = Members.findOne({}, {sort: {number: -1}});
    return highestMember.number + 1;
  },
  findMemberNumber: function (memberId) {
    var member = Members.findOne(memberId);
    return member.number;
  }
});
