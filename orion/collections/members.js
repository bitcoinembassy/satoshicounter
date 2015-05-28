Members = new orion.collection('members', {
  singularName: 'member',
  tabular: {
    order: [[0, "desc"]],
    columns: [
      {
        data: "createdAt",
        title: "Created",
        render: function(date) {
          return moment(date).calendar();
        }
      },
      { data: 'number', title: 'Number' },
      { data: 'firstName', title: 'First name' },
      { data: 'lastName', title: 'Last name' },
      { data: 'phoneNumber', title: 'Phone number' },
      { data: 'email', title: 'Email' },
      { data: 'level', title: 'Level' }
    ]
  }
});

Members.attachSchema(new SimpleSchema({
  createdAt: orion.attribute('createdAt'),
  number: {
    type: Number,
    unique: true,
    denyUpdate: true,
    optional: true,
    autoValue: function() {
      if (Meteor.isServer) {
        return incrementCounter('_counters', 'members');
      }
    },
    autoform: {
      omit: true
    }
  },
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  phoneNumber: {
    type: String,
    regEx: /^\d{3}-\d{3}-\d{4}$/,
    autoform: {
      afFieldInput: {
        type: "tel"
      }
    }
  },
  email: {
    type: String,
    regEx: SimpleSchema.RegEx.Email,
    unique: true,
    optional: true
  },
  level: {
    type: Number,
    allowedValues: [1, 2, 3],
    defaultValue: 1,
    autoform: {
      type: "select-radio-inline"
    }
  },
  idType: {
    type: String,
    label: "ID type",
    optional: true,
    allowedValues: ['driversLicense', 'healthInsuranceCard'],
    autoform: {
      type: "select-radio-inline",
      options: {
        driversLicense: "Driver's license",
        healthInsuranceCard: "Health insurance card"
      }
    }
  },
  idNumber: {
    type: String,
    label: "ID number",
    optional: true
  },
  notes: {
    type: String,
    optional: true,
    autoform: {
      rows: 5
    }
  }
}));
