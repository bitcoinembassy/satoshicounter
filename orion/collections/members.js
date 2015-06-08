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
      {
        data: 'createdAt',
        title: 'Joined',
        render: function(date) {
          return moment(date).calendar();
        }
      },
      { data: 'level', title: 'Level' }
    ]
  }
});

Members.attachSchema(new SimpleSchema({
  number: {
    type: Number,
    unique: true,
    optional: true,
    autoValue: function() {
      if (Meteor.isServer) {
        if (this.isInsert) {
          return incrementCounter('_counters', 'members');
        } else {
          this.unset();
        }
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
  createdAt: orion.attribute('createdAt'),
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
  dateOfBirth: {
    type: Date,
    optional: true
  },
  occupation: {
    type: String,
    optional: true
  },
  address: {
    type: String,
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
