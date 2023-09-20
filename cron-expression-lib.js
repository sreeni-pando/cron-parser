const cronValidate = require('cron-validate');

const ArrayDataMapping = {
  minutes: 'minutesArr',
  hours: 'hoursArr',
  daysOfMonth: 'dayOfMonthArr',
  months: 'monthsArr',
  daysOfWeek: 'dayOfWeeksArr',
};

const StartTimeDataMapping = {
  minutes: 0,
  hours: 1,
  daysOfMonth: 1,
  months: 1,
  daysOfWeek: 1,
};

const TimeDataMapping = {
  minutes: 59,
  hours: 23,
  daysOfMonth: 31,
  months: 12,
  daysOfWeek: 7,
};

class CronExpression {
  constructor(expression) {
    this.expression = expression;
    this.expressionSplit = [];
    this.minutesArr = [];
    this.hoursArr = [];
    this.dayOfMonthArr = [];
    this.monthsArr = [];
    this.dayOfWeeksArr = [];
    this.commandStr = '';
    this.errStr = '';
  }

  validateExpression() {
    let validValue = {};
    const splitArr = this.expression?.split(' ');
    if (splitArr?.length) {
      if (splitArr.length < 6) {
        this.errStr += 'Expression does NOT contain all 6 fields';
      } else {
        this.commandStr = splitArr[splitArr.length - 1];
        splitArr.pop();
        const cronExpressionGiven = splitArr?.join(' ');
        console.log(`cronExpressionGiven for validation:${cronExpressionGiven}`);
        const cronResult = cronValidate(cronExpressionGiven);
        if (cronResult.isValid()) {
          validValue = cronResult.getValue();
          console.log(`cronExpressionGiven validValue:${JSON.stringify(validValue)}`);
          // In this case, it would be:
          // { seconds: undefined, minutes: '*', hours: '*',
        //   daysOfMonth: '*', months: '*', daysOfWeek: '*', years: undefiend }
        } else {
          const errorValue = cronResult.getError();
          this.errStr += errorValue;
          // The error value includes an array of strings, which
          //    represent the cron validation errors.
          // string[] of error messages
        }
      }
    } else {
      this.errStr += 'Empty Expression';
    }
    return validValue;
  }

  evaluateExpression(validValue) {
    if (validValue && Object.keys(validValue)?.length) {
      Object.keys(validValue).forEach((key) => {
        if (ArrayDataMapping[key] && validValue[key]) {
          const currExp = validValue[key]?.toString();
          if (currExp) {
            if (currExp.includes('/')) {
              const currExpSplit = currExp.split('/');
              if (currExpSplit?.length) {
                const interval = parseInt(currExpSplit[1], 10);
                let startInterval = currExpSplit[0];
                if (startInterval === '*') {
                  for (let iter = 0; iter <= TimeDataMapping[key]; iter += interval) {
                    this[`${ArrayDataMapping[key]}`].push(iter);
                  }
                } else {
                  startInterval = parseInt(startInterval, 10);
                  for (let iter = startInterval; iter <= TimeDataMapping[key]; iter += interval) {
                    this[`${ArrayDataMapping[key]}`].push(iter);
                  }
                }
              }
            } else if (currExp.includes(',')) {
              const currExpSplit = currExp.split(',');
              if (currExpSplit?.length) {
                for (let iter = 0; iter < currExpSplit.length; iter += 1) {
                  this[`${ArrayDataMapping[key]}`].push(parseInt(currExpSplit[iter], 10));
                }
              }
            } else if (currExp.includes('-')) {
              const currExpSplit = currExp.split('-');
              if (currExpSplit?.length) {
                const startInterval = parseInt(currExpSplit[0], 10);
                const endInterval = parseInt(currExpSplit[1], 10);
                for (let iter = startInterval; iter <= endInterval; iter += 1) {
                  this[`${ArrayDataMapping[key]}`].push(parseInt(iter, 10));
                }
              }
            } else if (currExp === '*') {
              const startInterval = StartTimeDataMapping[key];
              const endInterval = TimeDataMapping[key];
              for (let iter = startInterval; iter <= endInterval; iter += 1) {
                this[`${ArrayDataMapping[key]}`].push(parseInt(iter, 10));
              }
            } else if (parseInt(currExp, 10) >= 0) {
              this[`${ArrayDataMapping[key]}`].push(parseInt(currExp, 10));
            }
          }
        }
      });
    }
  }

  printOutput() {
    console.log('\n********O/p starts from below******** \n');
    console.log(`minute ${this.minutesArr?.join(' ')}`);
    console.log(`hour ${this.hoursArr?.join(' ')}`);
    console.log(`day of month ${this.dayOfMonthArr?.join(' ')}`);
    console.log(`month ${this.monthsArr?.join(' ')}`);
    console.log(`day of week ${this.dayOfWeeksArr?.join(' ')}`);
    console.log(`command ${this.commandStr}`);
  }

  parseExpression() {
    try {
      if (this.expression) {
        const validValue = this.validateExpression(this.expression);
        if (this.errStr) {
          console.log(`Error occured: ${this.errStr}`);
        } else {
          this.evaluateExpression(validValue);
          this.printOutput();

        }
        return {
          minuteArr: this.minutesArr,
          hoursArr: this.hoursArr,
          dayOfMonthArr: this.dayOfMonthArr,
          monthsArr: this.monthsArr,
          dayOfWeeksArr: this.dayOfWeeksArr,
          errorMsg: this.errStr,
        };
      }
    } catch (err) {
      throw err;
    }
  }
}

module.exports = CronExpression;
