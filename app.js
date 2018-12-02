'use strict';

var SwaggerExpress = require('swagger-express-mw');
var app = require('express')();
module.exports = app; // for testing

var cors = require('cors');
app.use(cors());

const swaggerSecurity = require('C:/Users/k_nor/Desktop/penztarca-api/penztarca-api/api/helpers/swagger_security.js');


var config = {
  appRoot: __dirname, // required config
  swaggerSecurityHandlers: swaggerSecurity.swaggerSecurityHandlers
};


SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }

  // install middleware
  swaggerExpress.register(app);

  var port = process.env.PORT || 10010;
  app.listen(port);

  if (swaggerExpress.runner.swagger.paths['/hello']) {
    console.log('try this:\ncurl http://127.0.0.1:' + port + '/hello?name=Scott');
  }
});
