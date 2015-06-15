Meteor.methods({
  findMember: function (memberNumber) {
    var member = Members.findOne({number: memberNumber});
    if (member) {
      return member;
    } else {
      throw new Meteor.Error('member-not-found', "Invalid number");
    }
  }
});
