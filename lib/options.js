Options.set('forbidClientAccountCreation', false);

Options.set('profileSchema', {
  memberNumber: {
    type: Number,
    unique: true,
    denyUpdate: true,
    optional: true,
    autoValue: function() {
      if (Meteor.isServer) {
        return incrementCounter('_counters', 'members');
      }
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
  createdAt: orion.attribute('createdAt'),
  notes: {
    type: String,
    optional: true,
    autoform: {
      rows: 5
    }
  },
  bitcoinAddress: {
    type: String
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
  }
});

AccountsTemplates.configure({
  showPlaceholders: false
});

AccountsTemplates.removeField('name');
