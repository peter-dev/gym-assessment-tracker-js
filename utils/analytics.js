'use strict';

const BMIEnum = require('./bmi');
const conversion = require('./conversion');
const logger = require('./logger');

const analytics = {

  generateMemberStats(member) {
    let weight = member.startWeight;
    const assessments = member.assessments;
    if (assessments.length > 0) {
      const assessment = assessments[assessments.length - 1];
      weight = assessment.weight;
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

  calculateBmi(member, weight) {
    if (member.height <= 0) {
      return 0;
    } else {
      let height = member.height / 100;
      return (weight / (height * height)).toFixed(2);
    }
  },

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
    logger.info(`Ideal body weight: ${idealBodyWeight}`);
    return ((idealBodyWeight <= (weight + 2.0)) && (idealBodyWeight >= (weight
        - 2.0)));
  },

};

module.exports = analytics;