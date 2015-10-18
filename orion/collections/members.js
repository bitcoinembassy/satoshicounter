Members.attachSchema(new SimpleSchema({
  number: {
    type: Number,
    min: 1000,
    max: 100000,
    unique: true,
    autoValue: function() {
      if (this.isUpdate) {
        this.unset();
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
    unique: true,
    optional: true,
    autoform: {
      afFieldInput: {
        type: 'tel'
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
      type: 'select-radio-inline'
    }
  },
  idType: {
    type: String,
    label: 'ID type',
    optional: true,
    allowedValues: ['Driver\'s license', 'Health insurance card']
  },
  idNumber: {
    type: String,
    label: 'ID number',
    optional: true
  },
  notes: {
    type: String,
    optional: true,
    autoform: {
      rows: 5
    }
  },
  createdAt: orion.attribute('createdAt')
}));
