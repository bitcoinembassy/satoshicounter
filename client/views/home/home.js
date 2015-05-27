Meteor.subscribe("trades");

Template.home.helpers({
  verifiedUser: function() {
    var currentUser = Meteor.user();
    if (currentUser) {
      return Members.find({email: currentUser.emails[0].address});
    }
  },
  trades: function() {
    return Trades.find({});
  }
});
