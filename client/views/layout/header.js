Template.header.helpers({
  employee: function () {
    var employee = Meteor.user();
    if (employee) {
      var fullName = employee.profile.name.split(' ');
      return fullName[0];
    }
  }
});
