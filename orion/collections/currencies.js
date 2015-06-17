Currencies.attachSchema(new SimpleSchema({
  name: {
    type: String,
    unique: true
  },
  code: {
    type: String,
    unique: true
  },
  precision: {
    type: Number,
    defaultValue: 2
  }
}));
