MemberRole = new Roles.Role('member');

MemberRole.allow('collection.trades.index', true);

MemberRole.helper('collection.trades.indexFilter', function() {
  return { member: this.memberId };
});
