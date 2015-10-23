Template.header.helpers({
  employee: function () {
    return Meteor.user().profile.name
  }
});
