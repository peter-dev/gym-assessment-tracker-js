/**
 * The category is determined by the magnitude of the members BMI according to the following:
 *
 *     BMI less than    15   (exclusive)                      is "VERY SEVERELY UNDERWEIGHT"
 *     BMI between      15   (inclusive) and 16   (exclusive) is "SEVERELY UNDERWEIGHT"
 *     BMI between      16   (inclusive) and 18.5 (exclusive) is "UNDERWEIGHT"
 *     BMI between      18.5 (inclusive) and 25   (exclusive) is "NORMAL"
 *     BMI between      25   (inclusive) and 30   (exclusive) is "OVERWEIGHT"
 *     BMI between      30   (inclusive) and 35   (exclusive) is "MODERATELY OBESE"
 *     BMI between      35   (inclusive) and 40   (exclusive) is "SEVERELY OBESE"
 *     BMI greater than 40   (inclusive)                      is "VERY SEVERELY OBESE"
 */
const BMIEnum = {
  L1: {lowerRange: 0, upperRange: 15, name: 'VERY SEVERELY UNDERWEIGHT'},
  L2: {lowerRange: 15, upperRange: 16, name: 'SEVERELY UNDERWEIGHT'},
  L3: {lowerRange: 16, upperRange: 18.5, name: 'UNDERWEIGHT'},
  L4: {lowerRange: 18.5, upperRange: 25, name: 'NORMAL'},
  L5: {lowerRange: 25, upperRange: 30, name: 'OVERWEIGHT'},
  L6: {lowerRange: 30, upperRange: 35, name: 'MODERATELY OBESE'},
  L7: {lowerRange: 35, upperRange: 40, name: 'SEVERELY OBESE'},
  L8: {lowerRange: 40, upperRange: 1000, name: 'VERY SEVERELY OBESE'},
};

module.exports = BMIEnum;