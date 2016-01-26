var express = require('express');

express()
  .set('view engine', 'ejs')
  .use(express.static('./public'))
  .get('*', function (request, response) {
    response.render('index');
  })
  .listen(3000, function () {
    console.log('Listening on port 3000');
  });