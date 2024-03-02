export { runTests, ErrorWithArgs, areCloneLike };

String.prototype.if = String.prototype.repeat;

const allLogArgs = [];

const sup = '⁰¹²³⁴⁵⁶⁷⁸⁹';
const sub = '₀₁₂₃₄₅₆₇₈₉';

async function runTests(testSuite, delay = 0, {setup, teardown} = {}) {
  await pause(delay);
  
  const passedTests = {};
  const failedTests = {};
  const skippedTests = {};

  const onlyCases = Object.keys(testSuite).filter(testCase => testCase[0] == '$');

  if (onlyCases.length) {
    for (const testCase in testSuite) {
      if (testCase[0] != '$') {
        skippedTests[testCase] = testSuite[testCase];
        delete testSuite[testCase];
      }
    }
  }

  for (const testCase in testSuite) {
    if (testCase[0] == '_') {
      skippedTests[testCase] = testSuite[testCase];
      continue;
    }

    const test = testSuite[testCase];
    let startKit = {};

    try {
      if (setup) startKit = await setup();

      await test(startKit);

      passedTests[testCase] = test;

    } catch (error) {
      failedTests[testCase] = test;
      test.error = error.message;

    } finally {
      if (teardown) await teardown();
    }
  }

  const passedTestsCount = Object.keys(passedTests).length;
  const failedTestsCount = Object.keys(failedTests).length;
  const skippedTestsCount = Object.keys(skippedTests).length;
  const totalTestsCount = passedTestsCount + failedTestsCount + skippedTestsCount;
  const passedRatio = passedTestsCount / totalTestsCount;
  const failedRatio = failedTestsCount / totalTestsCount;
  const skippedRatio = skippedTestsCount / totalTestsCount;
  const barLength = 40;
  const passedBarLength = Math.round(passedRatio * barLength) || Math.ceil(passedRatio * barLength);
  const failedBarLength = Math.round(failedRatio * barLength) || Math.ceil(failedRatio * barLength);
  const skippedBarLength = Math.round(skippedRatio * barLength) || Math.ceil(skippedRatio * barLength);
  const failedTestsRep = prepNames(failedTests).join('\n - ');
  const passedTestsRep = prepNames(passedTests).join('\n + ');
  const skippedTestsRep = prepNames(skippedTests).join('\n - ');

  const successCountRep = passedTestsCount != totalTestsCount
    ? `%b${passedTestsCount}%n of ` : '%bAll%c ';
  const progressBarRep = `%l${'▒'.repeat(passedBarLength)
    }%r${'▒'.repeat(failedBarLength)}%g${'▒'.repeat(skippedBarLength)}`;
  const introRep = `${successCountRep}%b${totalTestsCount
    }%n tests run successfully.\n`;
  const passedRep = `\n\n%b${passedTestsCount
    }%n %lpassed%n tests are:\n + ${passedTestsRep}`
    .if((!!failedTestsCount || !!skippedTestsCount) && !!passedTestsCount);
  const failedRep = `\n\n%b${failedTestsCount
    }%n that %rfailed%n are:\n - ${failedTestsRep}`.if(!!failedTestsCount);
  const skippedRep = `\n\n%b${skippedTestsCount
    }%n tests were skipped:\n - ${skippedTestsRep}`.if(!!skippedTestsCount);
  const report = introRep + progressBarRep + failedRep + passedRep + skippedRep;

  console.log(...style(report));

  allLogArgs.forEach((logArgs, i) => {
    const method = logArgs.some(arg => arg instanceof Error) ? 'error' : 'log';

    console[method](`${(i + 1).toString().replace(/\d/, digit => sub[digit])}`,...logArgs)
  });
}

function prepNames(testDict) {
  return Object.entries(testDict).map(([name, { error }]) => `%u${name.replace(/([A-Z])/g, ' $1').replace(/_|\$/g, '').trim().toLowerCase()}%n` + `: %r${error}%n`.if(!!error).replace(/ \((\d+)\)(%n)?$/, (_, digits) => '%n' + [...digits].map(digit => sup[digit]).join('')).replace(/ /g, ' %r'));
}

function style(report) {
  const styling = { '%n': '', '%b': 'font-weight: bold', '%u': 'text-decoration: underline', '%l': 'color: lime', '%r': 'color: red', '%g': 'color: gray' };
  const styles = [];

  return [report.replace(/%\w/g, match => styles.push(styling[match]) && '%c'), ...styles];
}

function ErrorWithArgs(message, ...logArgs) {
  if (logArgs.length) allLogArgs.push(logArgs);

  return new Error(message + ` (${allLogArgs.length})`.if(logArgs.length > 0));
}

function areCloneLike(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function pause(delay) {
  return new Promise(resolve => setTimeout(resolve, delay));
}
