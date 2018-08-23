'use strict';

const helpers = {
  // https://stackoverflow.com/questions/8853396/logical-operator-in-a-handlebars-js-if-conditional/16315366#16315366
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

    if (options === 'partial') {
      return dd + '-' + mmm + '-' + yyyy;
    } else {
      return dd + '-' + mmm + '-' + yyyy + ' ' + hh + ':' + mm + ':' + ss;
    }
  },
  // https://stackoverflow.com/questions/3224834/get-difference-between-2-dates-in-javascript
  date_diff_in_days: function (rawDate, options) {
    const MS_PER_DAY = 1000 * 60 * 60 * 24;
    const date = new Date(rawDate);
    const today = new Date();
    const diff = Math.floor((today - date) / MS_PER_DAY);

    if (diff > 1) {
      return diff + ' days ago';
    } else {
      return diff + ' day ago';
    }
  }
};

module.exports = helpers;