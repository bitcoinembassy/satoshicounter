if (orion.config.get('KADIRA_APP_ID') && orion.config.get('KADIRA_APP_SECRET')) {
  Kadira.connect(orion.config.get('KADIRA_APP_ID'), orion.config.get('KADIRA_APP_SECRET'));
}