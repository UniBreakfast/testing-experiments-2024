// import { selectWithMethods as swm } from './swm.js';
let swm = import('./swm.js');

console.log('swm is selectWithMethods');

const testSuite = {
  thereIsOneSelect() {
    if (document.querySelectorAll('select').length != 1) {
      throw new Error('There should be one select element');
    }
  },

  selectIsVisible() {
    const select = document.querySelector('select');
    const computedStyle = getComputedStyle(select);

    if (
      computedStyle.display == 'none'
      || computedStyle.visibility == 'hidden'
      || computedStyle.opacity < 0.1
      || select.offsetWidth < 1
      || select.offsetHeight < 1
    ) {
      throw new Error('Select should be visible');
    }
  },

  swmObjectIsImported() {
    if (!swm || typeof swm != 'object') {
      throw new Error('swm object should be imported');
    }
  },

  swmHasMethods() {
    const swmBeLike = {
      getSelect() { },
      createOptions() { },
      getOptions() { },
      replaceOptions() { },
      addOptions() { },
      removeOptions() { },
      selectOption() { },
      getSelected() { },
      hideOptions() { },
      showOptions() { },
      markOptions() { },
      unmarkOptions() { },
      getMarked() { },
      setMark() { },
      getMark() { },
    };

    for (const method in swmBeLike) {
      if (!swm[method] || typeof swm[method] != 'function') {
        throw new Error(`swm should have a method ${method}()`);
      }
    }

    for (const method in swm) {
      if (!swmBeLike[method] || typeof swmBeLike[method] != 'function') {
        throw new Error(`swm should not have a method ${method}()`);
      }
    }

    if (Object.keys(swm).length != Object.keys(swmBeLike).length) {
      throw new Error('swm should not have any extra properties or methods');
    }
  },

  getSelectReturnsSelect() {
    const select = swm.getSelect();

    if (select.localName != 'select') {
      throw new Error('getSelect() should return a select element');
    }
  },

  createsOptionsAndReturnsThem() {
    const dict = { a: 'Alpha', b: 'Beta', c: 'Charlie' };

    const options = swm.createOptions({ dict });
    const entries = Object.entries(dict);

    const allOptionsCreatedCorrectly = entries.length == options?.length && entries
      .every(([value, text], i) => options[i].value == value && options[i].text == text);

    if (!allOptionsCreatedCorrectly) {
      throw new Error('Options were not created correctly or method did not return them');
    }
  },

  createsOptionsAndReplacesWithThem() {
    const dict = { b: 'Beta', c: 'Charlie', d: 'Delta' };

    const select = swm.getSelect();

    swm.createOptions({ dict, replace: true });

    const options = select.options;
    const entries = Object.entries(dict);

    const allOptionsCreatedCorrectly = entries.length == options?.length && entries.every(([value, text], i) => options[i].value == value && options[i].text == text);

    if (!allOptionsCreatedCorrectly) {
      throw new Error('Options were not created correctly or method did not replace them');
    }
  },
}

getReady().then(
  () => setTimeout(runTests, 500)
);

async function getReady() {
  String.prototype.if = String.prototype.repeat;

  return {swm} = await swm;
}

async function runTests() {
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

    try {
      await test();

      passedTests[testCase] = test;
    } catch (error) {
      failedTests[testCase] = test;
      test.error = error.message;
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
    .if(!!failedTestsCount && !!passedTestsCount);
  const failedRep = `\n\n%b${failedTestsCount
    }%n that %rfailed%n are:\n - ${failedTestsRep}`.if(!!failedTestsCount);
  const skippedRep = `\n\n%b${skippedTestsCount
    }%n tests were skipped:\n - ${skippedTestsRep}`.if(!!skippedTestsCount);
  const report = introRep + progressBarRep + failedRep + passedRep + skippedRep;

  console.log(...style(report));
}

function prepNames(testDict) {
  return Object.entries(testDict).map(([name, { error }]) => `%u${name.replace(/([A-Z])/g, ' $1').replace(/_|\$/g, '').trim().toLowerCase()}%n` + `: %r${error}%n`.if(!!error));
}

function style(report) {
  const styling = { '%n': '', '%b': 'font-weight: bold', '%u': 'text-decoration: underline', '%l': 'color: lime', '%r': 'color: red', '%g': 'color: gray' };
  const styles = [];

  return [report.replace(/%\w/g, match => styles.push(styling[match]) && '%c'), ...styles];
}

function areCloneLike(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}
