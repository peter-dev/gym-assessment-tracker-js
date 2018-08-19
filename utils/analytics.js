'use strict';

const BMIEnum = require('./bmi');
const conversion = require('./conversion');
const logger = require('./logger');

const analytics = {

  generateMemberStats(member) {
    let weight = member.startWeight;
    if (member.assessments.length > 0) {
      const sorted = member.assessments.sort(function (a, b) {
        return new Date(b.date) - new Date(a.date);
      });
      weight = sorted[0].weight;
    }
    let bmi = this.calculateBmi(member, weight);
    let bmiCategory = this.determineBMICategory(bmi);
    let isIdealBodyWeight = this.isIdealBodyWeight(member, weight);

    const stats = {
      bmi: bmi,
      bmiCategory: bmiCategory,
      isIdealBodyWeight: isIdealBodyWeight,
    };

    return stats;
  },

  /**
   * Return BMI for the member based on the calculation: BMI is weight divided by the square of
   * the height.
   */
  calculateBmi(member, weight) {
    if (member.height <= 0) {
      return 0;
    } else {
      let height = member.height / 100;
      return (weight / (height * height)).toFixed(2);
    }
  },

  /**
   * Return category the BMI belongs to, based on the predefined values in BMIEnum
   */
  determineBMICategory(value) {
    // loop through the key values inside the enum object
    for (let BMIKey in BMIEnum) {
      const BMIObject = BMIEnum[BMIKey];
      // check upper and lower limit for each enum and return description
      if ((value >= BMIObject.lowerRange) && (value < BMIObject.upperRange)) {
        return BMIObject.name;
      }
    }
    return 'NO CATEGORY AVAILABLE';
  },

  /**
   * Returns a boolean to indicate if the member has an ideal body weight.
   */
  isIdealBodyWeight(member, weight) {
    let idealBodyWeight;
    const fiveFeet = 60;
    const inches = conversion.metresToInches(member.height / 100);

    if (inches <= fiveFeet) {
      if (member.gender === "M") {
        idealBodyWeight = 50;
      } else {
        idealBodyWeight = 45.5;
      }
    } else {
      if (member.gender === "M") {
        idealBodyWeight = (50 + ((inches - fiveFeet) * 2.3)).toFixed(2);
      } else {
        idealBodyWeight = (45.5 + ((inches - fiveFeet) * 2.3)).toFixed(2);
      }
    }
    logger.info(
        `Ideal body weight: ${idealBodyWeight} and current weight is: ${weight}`);
    return ((idealBodyWeight <= (weight + 2.0)) && (idealBodyWeight >= (weight
        - 2.0)));
  },

  /**
   * Returns an integer to determine if trend is up (1), down (-1), or no change (0)
   */
  determineTrend(member, assessment) {
    let weight = member.startWeight;
    // at least one previous assessment available, sort by date descending date and get the latest weight
    if (member.assessments.length > 0) {
      // https://en.proft.me/2015/11/14/sorting-array-objects-number-string-date-javascrip/
      const sorted = member.assessments.sort(function (a, b) {
        return new Date(b.date) - new Date(a.date);
      });
      weight = sorted[0].weight;
    }
    if (assessment.weight > weight) {
      return 1;
    }
    if (assessment.weight < weight) {
      return -1;
    }
    // default, no change
    return 0;
  }
};

module.exports = analytics;