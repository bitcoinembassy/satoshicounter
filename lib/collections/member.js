Members = new orion.collection('members', {
  singularName: 'member',
  tabular: {
    order: [[0, "desc"]],
    columns: [
      { data: 'number', title: 'Number' },
      { data: 'firstName', title: 'First name' },
      { data: 'lastName', title: 'Last name' },
      { data: 'phoneNumber', title: 'Phone number' },
      { data: 'email', title: 'Email' },
      { data: 'level', title: 'Level' },
      {
        data: 'createdAt',
        title: 'Joined',
        render: function(date) {
          return moment(date).calendar();
        }
      }
    ]
  }
});
