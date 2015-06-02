MemberRole = new Roles.Role('member');

MemberRole.allow('collections.trades.index', true);

MemberRole.helper('collections.trades.indexFilter', function() {
  return { member: this.memberId };
});
