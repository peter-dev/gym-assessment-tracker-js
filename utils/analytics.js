'use strict';

const BMIEnum = require('./bmi');
const conversion = require('./conversion');
const logger = require('./logger');

const analytics = {

  /**
   * Generate statistics for a given member, return object that contains:
   * - bmi value
   * - bmi category
   * - is ideal body weight indicator
   * - goals summary (open vs completed)
   */
  generateMemberStats(member, assessments, goals) {
    let weight = member.startWeight;
    if (assessments.length > 0) {
      // assessments are already sorted by date descending, first item on the list is the latest assessment
      weight = assessments[0].weight;
    }
    let bmi = this.calculateBmi(member, weight);
    let bmiCategory = this.determineBMICategory(bmi);
    let isIdealBodyWeight = this.isIdealBodyWeight(member, weight);
    let goals_summary = this.prepareGoalsReport(goals);

    const stats = {
      bmi: bmi,
      bmiCategory: bmiCategory,
      isIdealBodyWeight: isIdealBodyWeight,
      goals_stats: goals_summary
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
    //logger.info(`Ideal body weight: ${idealBodyWeight} and current weight is: ${weight}`);
    return ((idealBodyWeight <= (weight + 2.0)) && (idealBodyWeight >= (weight
        - 2.0)));
  },

  /**
   * Returns an integer to determine if trend is up (1), down (-1), or no change (0)
   */
  determineTrend(initialWeight, assessments, assessment) {
    let weight = initialWeight;
    // at least one previous assessment available, sort by date descending date and get the latest weight
    if (assessments.length > 0) {
      // https://en.proft.me/2015/11/14/sorting-array-objects-number-string-date-javascrip/
      const sorted = assessments.sort(function (a, b) {
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
  },

  /**
   * Returns an integer to determine if goal is to go gain (1) or lose (-1)
   */
  determineGoalDirection(assessments, goal) {
    const goal_type = goal.type.toLowerCase();
    const goal_target = goal.target;
    // initially the goal is to gain if no previous assessment available
    let last = 0;
    // at least one previous assessment available, sort by date descending date and get the value
    if (assessments.length > 0) {
      const sorted = assessments.sort(function (a, b) {
        return new Date(b.date) - new Date(a.date);
      });
      last = sorted[0][goal_type];
    }
    return (goal_target >= last) ? 1 : -1;
  },

  /**
   * Iterate through collection of goals and determine number of completed, missed and open goals
   */
  prepareGoalsReport(goals) {
    let completed = 0;
    let missed = 0;
    let open = 0;
    for (let i = 0; i < goals.length; i++) {
      if (goals[i].status === 'Completed') {
        completed++;
      } else if (goals[i].status === 'Missed') {
        missed++;
      } else if (goals[i].status === 'Open') {
        open++;
      }
    }
    // do not include missed in total summary but calculate the no of missed goals
    const total = completed + open;
    const completed_percentage = ((completed / total) * 100) ? ((completed
        / total) * 100).toFixed(0) : 0;
    const open_percentage = ((open / total) * 100) ? ((open / total)
        * 100).toFixed(0) : 0;
    return {
      completed: completed,
      completed_percentage: completed_percentage,
      open: open,
      open_percentage: open_percentage,
      missed: missed,
      total: total
    };
  },

  /**
   * Iterate through the list of open goals and compare against the latest assessment, update status
   */
  updateGoals(goals, assessment) {
    // at least one goal available
    if (goals.length > 0) {
      // for each open goal get the type, target value
      for (let i = 0; i < goals.length; i++) {
        if (goals[i].status === 'Open') {
          const goal_type = goals[i].type.toLowerCase();
          const goal_target = goals[i].target;
          const goal_direction = goals[i].direction;
          // get assessment value that matches goal type (i.e. weight, chest)
          const last = assessment[goal_type];
          // compare goal target with the newly created assessment
          if ((goal_direction > 0 && last >= goal_target) || (goal_direction < 0
              && last <= goal_target)) {
            goals[i].status = 'Completed';
            goals[i].status_date = new Date();
          }
        }
      }
    }
    return goals;
  },

  /**
   * Iterate through the list of open goals and check the date, update status
   */
  updateMissedGoals(goals) {
    // at least one goal available
    if (goals.length > 0) {
      // for each open goal compare the target date with current date
      for (let i = 0; i < goals.length; i++) {
        if (goals[i].status === 'Open') {
          const goal_due_date = new Date(goals[i].target_date);
          const today = new Date();
          if (goal_due_date < today) {
            goals[i].status = 'Missed';
            goals[i].status_date = today;
          }
        }
      }
    }
    return goals;
  }
};

module.exports = analytics;