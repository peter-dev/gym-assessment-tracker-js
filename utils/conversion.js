'use strict';

const conversion = {
  metresToInches(numberToConvert) {
    return (numberToConvert * 39.37).toFixed(2);
  },
};

module.exports = conversion;