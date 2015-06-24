Meteor.publish('members', function() {
  return Members.find({}, {fields: {number: 1}});
});
