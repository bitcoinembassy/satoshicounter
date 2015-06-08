orion.accounts.tabular.options.columns = [
  {
    data: 'emails[0].address',
    title: i18n('accounts.index.tableTitles.email')
  },
  {
    title: i18n('accounts.index.tableTitles.enrolled'),
    tmpl: Meteor.isClient && Template[ReactiveTemplates.get('accounts.index.enrolled')]
  },
  {
    data: 'roles()',
    title: i18n('accounts.index.tableTitles.roles'),
    render: function(roles) {
      var labels = roles.map(function(role) {
        return '<span class="label label-danger">' + role + '</span>';
      });
      return labels.join(' ');
    }
  },
  {
    title: i18n('accounts.index.tableTitles.actions'),
    tmpl: Meteor.isClient && Template[ReactiveTemplates.get('accounts.index.buttons')]
  }
];
