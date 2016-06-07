var express = require('express');
var login = require('./login');

express()
  .set('view engine', 'ejs')
  .use(express.static('./public'))
  .use(login.routes)
  .use(require('./chirps'))
  .get('*', login.required, function (request, response) {
    response.render('index', {
        user: login.safe(request.user)
    });
  })
  .listen(process.env.PORT || 3000, function () {
    console.log('Listening on port 3000');
  });
