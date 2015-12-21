Router.route('/download-members', function() {
  var data = Members.find({}, {sort: {createdAt: -1}}).fetch();
  var fields = [
    {
      key: 'number',
      title: 'Member number',
      type: 'number'
    },
    {
      key: 'firstName',
      title: 'First name'
    },
    {
      key: 'lastName',
      title: 'Last name'
    },
    {
      key: 'phoneNumber',
      title: 'Phone number'
    },
    {
      key: 'email',
      title: 'Email'
    },
    {
      key: 'level',
      title: 'Level',
      type: 'number'
    },
    {
      key: 'notes',
      title: 'Notes'
    },
    {
      key: 'createdAt',
      title: 'Date',
      transform: function (val) {
        return moment(val).format('M/D/YYYY HH:mm:ss');
      }
    }
  ];

  var title = 'Members';
  var file = Excel.export(title, fields, data);
  var headers = {
    'Content-type': 'application/vnd.openxmlformats',
    'Content-Disposition': 'attachment; filename=' + title + '.xlsx'
  };

  this.response.writeHead(200, headers);
  this.response.end(file, 'binary');
}, { where: 'server' });
