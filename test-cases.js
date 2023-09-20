const expect = require('chai').expect;
const CronExpression = require('./cron-expression-lib');

describe('Testing positive Cases',() => {
    it('1. Every second Cron', (done) => {
        const expression = '* * * * * /user/bin';
        const response = new CronExpression(expression).parseExpression();
        console.log(`response:${JSON.stringify(response)}`);
        expect(response.minuteArr.length).to.equal(60);
        expect(response.hoursArr.length).to.equal(23);
        expect(response.dayOfMonthArr.length).to.equal(31);
        expect(response.monthsArr.length).to.equal(12);
        expect(response.dayOfWeeksArr.length).to.equal(7);
        done();
    });

    it('2. At 12:00 p.m. (noon) every day', (done) => {
        const expression = '0 12 * * * /user/bin';
        const response = new CronExpression(expression).parseExpression();
        console.log(`response:${JSON.stringify(response)}`);
        expect(response.minuteArr.length).to.equal(1);
        expect(response.hoursArr.length).to.equal(1);
        expect(response.dayOfMonthArr.length).to.equal(31);
        expect(response.monthsArr.length).to.equal(12);
        expect(response.dayOfWeeksArr.length).to.equal(7);
        done();
    });

    it(`3. Every five minutes starting at 1 p.m. and ending at 1:55 p.m. 
        and then starting at 6 p.m. and ending at 6:55 p.m every day`, (done) => {
        const expression = '0/5 13,18 * * * /user/bin';
        const response = new CronExpression(expression).parseExpression();
        console.log(`response:${JSON.stringify(response)}`);
        expect(response.minuteArr.length).to.equal(12);
        expect(response.hoursArr.length).to.equal(2);
        expect(response.dayOfMonthArr.length).to.equal(31);
        expect(response.monthsArr.length).to.equal(12);
        expect(response.dayOfWeeksArr.length).to.equal(7);
        done();
    });

    it('4. Every minute starting at 1 p.m. and ending at 1:05 p.m., every day', (done) => {
        const expression = '0-5 13 * * * /user/bin';
        const response = new CronExpression(expression).parseExpression();
        console.log(`response:${JSON.stringify(response)}`);
        expect(response.minuteArr.length).to.equal(6);
        expect(response.hoursArr.length).to.equal(1);
        expect(response.dayOfMonthArr.length).to.equal(31);
        expect(response.monthsArr.length).to.equal(12);
        expect(response.dayOfWeeksArr.length).to.equal(7);
        done();
    });
});

describe('Testing negative Cases',() => {
    it('1. Command Not Specified', (done) => {
        const expression = '* * * * *';
        const response = new CronExpression(expression).parseExpression();
        console.log(`response:${JSON.stringify(response)}`);
        expect(response.minuteArr.length).to.equal(0);
        expect(response.hoursArr.length).to.equal(0);
        expect(response.dayOfMonthArr.length).to.equal(0);
        expect(response.monthsArr.length).to.equal(0);
        expect(response.dayOfWeeksArr.length).to.equal(0);
        expect(response.errorMsg).to.equal('Expression does NOT contain all 6 fields');
        done();
    });

    it('2. Cron Expression contaions only 4 fields', (done) => {
        const expression = '* * * * /user/bin';
        const response = new CronExpression(expression).parseExpression();
        console.log(`response:${JSON.stringify(response)}`);
        expect(response.minuteArr.length).to.equal(0);
        expect(response.hoursArr.length).to.equal(0);
        expect(response.dayOfMonthArr.length).to.equal(0);
        expect(response.monthsArr.length).to.equal(0);
        expect(response.dayOfWeeksArr.length).to.equal(0);
        expect(response.errorMsg).to.equal('Expression does NOT contain all 6 fields');
        done();
    });

    it(`3. Minutes Greater than 60`, (done) => {
        const expression = '62 * * * * /user/bin';
        const response = new CronExpression(expression).parseExpression();
        console.log(`response:${JSON.stringify(response)}`);
        expect(response.minuteArr.length).to.equal(0);
        expect(response.hoursArr.length).to.equal(0);
        expect(response.dayOfMonthArr.length).to.equal(0);
        expect(response.monthsArr.length).to.equal(0);
        expect(response.dayOfWeeksArr.length).to.equal(0);
        expect(response.errorMsg).to.include("bigger than upper limit");
        done();
    });

    it(`3. Hours Greater than 24`, (done) => {
        const expression = '* 25 * * * /user/bin';
        const response = new CronExpression(expression).parseExpression();
        console.log(`response:${JSON.stringify(response)}`);
        expect(response.minuteArr.length).to.equal(0);
        expect(response.hoursArr.length).to.equal(0);
        expect(response.dayOfMonthArr.length).to.equal(0);
        expect(response.monthsArr.length).to.equal(0);
        expect(response.dayOfWeeksArr.length).to.equal(0);
        expect(response.errorMsg).to.include("bigger than upper limit");
        done();
    });
});