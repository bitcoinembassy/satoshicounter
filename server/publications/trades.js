Meteor.publishComposite('trade', function (tradeId) {
  check(tradeId, String);

  return {
    find: function() {
      return Trades.find(tradeId);
    },
    children: [
      {
        find: function (trade) {
          return Members.find(trade.member);
        }
      }
    ]
  }
});
