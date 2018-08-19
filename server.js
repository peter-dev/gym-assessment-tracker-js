'use strict';

const express = require('express');
const logger = require('./utils/logger');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');

// init project
const app = express();
app.use(cookieParser());
const exphbs = require('express-handlebars');
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static('public'));
app.use(fileUpload());
app.engine('.hbs', exphbs({
  // register custom helper functions
  // https://stackoverflow.com/questions/8853396/logical-operator-in-a-handlebars-js-if-conditional/16315366#16315366
  helpers: {
    if_cond: function (v1, operator, v2, options) {
      switch (operator) {
        case '==':
          return (v1 == v2) ? options.fn(this) : options.inverse(this);
        case '===':
          return (v1 === v2) ? options.fn(this) : options.inverse(this);
        case '!=':
          return (v1 != v2) ? options.fn(this) : options.inverse(this);
        case '!==':
          return (v1 !== v2) ? options.fn(this) : options.inverse(this);
        case '<':
          return (v1 < v2) ? options.fn(this) : options.inverse(this);
        case '<=':
          return (v1 <= v2) ? options.fn(this) : options.inverse(this);
        case '>':
          return (v1 > v2) ? options.fn(this) : options.inverse(this);
        case '>=':
          return (v1 >= v2) ? options.fn(this) : options.inverse(this);
        case '&&':
          return (v1 && v2) ? options.fn(this) : options.inverse(this);
        case '||':
          return (v1 || v2) ? options.fn(this) : options.inverse(this);
        default:
          return options.inverse(this);
      }
    },
    // https://www.w3schools.com/js/js_date_methods.asp
    format_date: function (rawDate, options) {
      const date = new Date(rawDate);
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug",
        "Sep", "Oct", "Nov", "Dec"];
      const yyyy = date.getFullYear();
      let dd = date.getDate();
      const mmm = months[date.getMonth()];
      let hh = date.getHours();
      let mm = date.getMinutes();
      let ss = date.getSeconds();

      if (dd < 10) {
        dd = '0' + dd;
      }
      if (hh < 10) {
        hh = '0' + hh;
      }
      if (mm < 10) {
        mm = '0' + mm;
      }
      if (ss < 10) {
        ss = '0' + ss;
      }

      return dd + '-' + mmm + '-' + yyyy + ' ' + hh + ':' + mm + ':' + ss;
    }
  },
  extname: '.hbs',
  defaultLayout: 'main',
}));
app.set('view engine', '.hbs');

const routes = require('./routes');
app.use('/', routes);

// listen for requests :)
var listener = app.listen(process.env.PORT || 4000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
