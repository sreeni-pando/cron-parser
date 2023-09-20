const CronExpression = require('./cron-expression-lib');

function run(expression = '') {
  try {
    new CronExpression(expression).parseExpression();
  } catch (err) {
    console.error('issue in run');
    throw err;
  }
}

run(process.argv[2]);
