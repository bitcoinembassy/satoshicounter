// Router.route('/download-trades', function() {
//   var data = Trades.find().fetch();
//   var fields = [
//     {
//       key: 'amountReceived',
//       title: 'Amount received',
//       type: 'number'
//     },
//     {
//       key: 'amountSend',
//       title: 'Amount sent',
//       type: 'number'
//     }
//   ];
//
//   var title = 'Trades';
//   var file = Excel.export(title, fields, data);
//   var headers = {
//     'Content-type': 'application/vnd.openxmlformats',
//     'Content-Disposition': 'attachment; filename=' + title + '.xlsx'
//   };
//
//   this.response.writeHead(200, headers);
//   this.response.end(file, 'binary');
// }, { where: 'server' });
