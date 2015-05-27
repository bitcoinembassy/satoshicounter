Options.set('forbidClientAccountCreation', false);

Options.set('profileSchema', {
  bitcoinAddress: {
    type: String
  }
});

AccountsTemplates.configure({
  showPlaceholders: false
});

AccountsTemplates.removeField('name');
