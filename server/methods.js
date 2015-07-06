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
  }
});
