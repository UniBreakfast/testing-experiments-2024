const testSuite = {
  pageHasOneButton() {
    const btn = document.body.firstElementChild;

    if (btn.tagName != 'BUTTON' || document.body.lastElementChild != btn) {
      throw new Error('Page should only have one button');
    }
  },
  buttonClickRemovesIt() {
    const btn = document.body.firstElementChild;

    btn.click();

    if (document.body.firstElementChild == btn) {
      throw new Error('Button should be removed after clicking');
    }
  },
}

getReady();

setTimeout(runTests, 500);

function runTests() {
  const passedTests = {};
  const failedTests = {};

  for (const testCase in testSuite) {
    const test = testSuite[testCase];

    try {
      test();

      passedTests[testCase] = test;
    } catch (error) {
      failedTests[testCase] = test;
      test.error = error.message;
    }
  }

  const passedTestsCount = Object.keys(passedTests).length;
  const failedTestsCount = Object.keys(failedTests).length;
  const totalTestsCount = passedTestsCount + failedTestsCount;
  const passedPercentage = (passedTestsCount / totalTestsCount) * 100;
  const barLength = 40;
  const passedBarLength = Math.round((passedPercentage / 100) * barLength);
  const failedBarLength = barLength - passedBarLength;
  const failedTestsRep = prepNames(failedTests).join('\n - ');
  const passedTestsRep = prepNames(passedTests).join('\n + ');

  const successCountRep = failedTestsCount
    ? `%b${passedTestsCount}%n of ` : '%bAll%c ';
  const progressBarRep = `%l${'▒'.repeat(passedBarLength)
    }%r${'▒'.repeat(failedBarLength)}`;
  const failedRep = `\n\n%b${failedTestsCount
    }%n that %rfailed%n are:\n - ${failedTestsRep}`.if(!!failedTestsCount);
  const passedRep = `\n\n%b${passedTestsCount
    }%n %lpassed%n tests are:\n + ${passedTestsRep}`
    .if(!!failedTestsCount && !!passedTestsCount);
  const introRep = `${successCountRep}%b${totalTestsCount
    }%n tests run successfully.\n`;
  const report = introRep + progressBarRep + failedRep + passedRep;

  console.log(...style(report));
}

function prepNames(testDict) {
  return Object.entries(testDict).map(([name, {error}]) => `%u${name.replace(/([A-Z])/g, ' $1').trim().toLowerCase()}%n` + `: %r${error}%n`.if(!!error));
}

function style(report) {
  const styling = { '%n': '', '%b': 'font-weight: bold', '%u': 'text-decoration: underline', '%l': 'color: lime', '%r': 'color: red', '%p': 'color: deeppink'};
  const styles = [];

  return [report.replace(/%\w/g, match => styles.push(styling[match]) && '%c'), ...styles];
}

function getReady() {
  String.prototype.if = String.prototype.repeat;
}
