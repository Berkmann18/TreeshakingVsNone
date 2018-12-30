const Suite = require('benchmark').Suite,
  chalk = require('chalk');

const scores = {
  without: { positive: 0, negative: 0 },
  with: { positive: 0, negative: 0 },
  withDirect: { positive: 0, negative: 0 }
};
let totalTests = 0;

function onComplete() {
  let fastest = String(this.filter('fastest').map('name')),
    slowest = String(this.filter('slowest').map('name'));
  console.log(`\tBenchmark: ${chalk.cyan(this.name)}\nThe fastest is ${chalk.black.bgGreen(fastest)}\nThe slowest is ${chalk.black.bgRed(slowest)}\n`);

  if (fastest.includes(',')) {
    fastest
      .split(',')
      .forEach(lib => ++scores[lib].positive)
  } else ++scores[fastest].positive;
  if (slowest.includes(',')) {
    slowest
      .split(',')
      .forEach(lib => ++scores[lib].negative)
  } else ++scores[slowest].negative;

  ++totalTests;
  console.log(`Scores (/${chalk.keyword('orange')(totalTests)}): \n`);
  for (let lib in scores) {
    console.log(`${chalk.yellow(lib)}: ${chalk.greenBright(scores[lib].positive + '+')} / ${chalk.redBright(scores[lib].negative + '-')} = ${chalk.blueBright(scores[lib].positive - scores[lib].negative)}`)
  }
}
const onCycle = event => console.log(`${event.target}`);
const opts = {
  onComplete,
  onCycle,
}

const sum = new Suite('sum', opts),
  sumNProd = new Suite('sum&prod', opts),
  andFactorial = new Suite('sum&prod&factorial', opts);

sum.add('without', () => {
    const math = require('math');
    let x = math.sum([1, 2, 3, 4, 5])
  })
  .add('with', () => {
    const { sum } = require('math');
    let x = sum([1, 2, 3, 4, 5])
  })
  .add('withDirect', () => {
    const sum = require('math').sum;
    let x = sum([1, 2, 3, 4, 5])
  })
  .run({ 'async': true });

sumNProd.add('without', () => {
    const math = require('math');
    let x = math.sum([6, 7, 8]);
    let y = math.prod([99, 7, 3])
  })
  .add('with', () => {
    const { sum, prod } = require('math');
    let x = sum([6, 7, 8]);
    let y = prod([99, 7, 3])
  })
  .run({ 'async': true });

// andFactorial.add('without', () => {
//     const math = require('math');
//     let x = math.sum([9, 10, 11]);
//     let y = math.prod([4, 2, 1]);
//     let z = math.factorial(42)
//   })
//   .add('with', () => {
//     const { sum, prod, factorial } = require('math');
//     let x = sum([9, 10, 11]);
//     let y = prod([4, 2, 1]);
//     let z = factorial(42)
//   })
//   .run({ 'async': true });