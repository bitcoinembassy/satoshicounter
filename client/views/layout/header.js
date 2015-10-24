Template.header.helpers({
  employee: function () {
    var fullName = Meteor.user().profile.name.split(' ');
    return fullName[0];
  }
});
