Currencies.attachSchema(new SimpleSchema({
  name: {
    type: String,
    unique: true
  },
  code: {
    type: String,
    unique: true
  },
  denomination: {
    type: String,
    unique: true
  },
  slug: {
    type: String,
    unique: true,
    autoValue: function() {
      var denomination = this.field('denomination');
      if (denomination.isSet) {
        return getSlug(denomination.value);
      } else {
        this.unset();
      }
    }
  },
  precision: {
    type: Number,
    defaultValue: 2
  }
}));
