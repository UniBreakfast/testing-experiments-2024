import { runTests, ErrorWithArgs, areCloneLike } from '../test.js'; // project://select-with-methods/select-with-methods.html

console.log('"swm" means "Select With Methods"');

const delay = 500;

import('./swm.js').then(({ selectWithMethods: swm, reset }) => {
  const testSuite = {
    swmObjectIsImported() {
      if (!swm || typeof swm != 'object') {
        throw new ErrorWithArgs(
          'swm was not imported correctly',
          'expected an object with methods but instead got',
          swm,
        );
      }
    },

    swmHasMethods() {
      const swmBeLike = {
        createSelect() { },
        removeSelect() { },
        replaceSelect() { },
        placeSelect() { },
        getSelect() { },
        setSelect() { },
        hideSelect() { },
        showSelect() { },
        createOptions() { },
        addOptions() { },
        getValue() { },
        setMark() { },
        getMark() { },
        markOption() { },
        unmarkOption() { },
      };

      for (const method in swmBeLike) {
        if (!swm[method] || typeof swm[method] != 'function') {
          throw new ErrorWithArgs(
            `swm should have a method ${method}().`,
            'instead it looks like this',
            swm,
          );
        }
      }

      for (const key in swm) {
        if (typeof swm[key] == 'function' && !swmBeLike[key]) {
          throw new ErrorWithArgs(
            `swm has an unexpected method ${key}().`,
            'unexpected method',
            swm[key],
          );
        }

        if (typeof swm[key] != 'function' && !swmBeLike[key]) {
          throw new ErrorWithArgs(
            `swm has an unexpected property ${key}.`,
            `unexpected property swm["${key}"]`,
            swm[key],
          );
        }
      }
    },

    createSelectReturnsNewSelect() {
      const select = swm.createSelect();

      if (!(select instanceof HTMLSelectElement)) {
        throw new ErrorWithArgs('swm.createSelect() should return a new select element', select);
      }
    },

    getSelectWithoutSelectReturnsNull() {
      const select = swm.getSelect();

      if (select !== null) {
        throw new ErrorWithArgs('swm.getSelect() without select should return null', select);
      }
    },

    getSelectWithSelectReturnsSelect({select}) {
      swm.setSelect(select);

      const received = swm.getSelect();

      if (received !== select) {
        throw new ErrorWithArgs('swm.getSelect() with select should return the select', received, 'where should be', select);
      }
    },

    setSelectWithoutArgumentsThrows() {
      try {
        swm.setSelect();

        throw null;

      } catch (err) {
        if (!err) {
          throw new Error('swm.setSelect() should throw an error if no select is passed');
        }
        if (err.message != 'No select passed') {
          throw new ErrorWithArgs('swm.setSelect() should throw an error with the message "No select passed"', err);
        }
      }
    },

    setSelectWithSelectDoesNotThrow({select}) {
      try {
        swm.setSelect(select);

      } catch (err) {
        throw new ErrorWithArgs('swm.setSelect() should not throw an error if a select is passed', err);
      }
    },

    setSelectSetsSelect({select}) {
      reset();

      const options = [new Option(), new Option()]

      try {
        swm.setSelect(select);
        swm.addOptions(options);

      } catch (err) {
        if (err.message == 'No select set') {
          throw new Error('swm.setSelect() should set the select');
        }
      }
    },

    setSelectWithNullUnsets({select}) {
      try {
        swm.setSelect(select);
        swm.setSelect(null);
        swm.getValue();

        throw null;

      } catch (err) {
        if (!err) {
          throw new Error('swm.setSelect() should unset the select');
        }

        if (err.message != 'No select set') {
          throw new ErrorWithArgs('swm.setSelect() should unset the select', err);
        }
      }
    },
      
    setSelectWithWrongArgumentThrows() {
      const notSelect = document.createElement('div');

      try {
        swm.setSelect(notSelect);

        throw null;

      } catch (err) {
        if (!err) {
          throw new Error('swm.setSelect() should throw an error if a non-select is passed');
        }

        if (err.message != 'No select passed') {
          throw new ErrorWithArgs('swm.setSelect() should throw an error with the message "No select passed"', err);
        }
      }
    },

    hideSelectWithoutSelectThrows() {
      try {
        swm.hideSelect();

        throw null;

      } catch (err) {
        if (!err) {
          throw new Error('swm.hideSelect() should throw an error if no select is set');
        }

        if (err.message != 'No select set') {
          throw new ErrorWithArgs('swm.hideSelect() should throw an error with the message "No select set"', err);
        }
      }
    },

    showSelectWithoutSelectThrows() {
      try {
        swm.showSelect();

        throw null;

      } catch (err) {
        if (!err) {
          throw new Error('swm.showSelect() should throw an error if no select is set');
        }

        if (err.message != 'No select set') {
          throw new ErrorWithArgs('swm.showSelect() should throw an error with the message "No select set"', err);
        }
      }
    },

    hideSelectHides({select}) {
      swm.setSelect(select);
      swm.hideSelect();

      if (!select.hidden) {
        throw new Error('swm.hideSelect() should hide the select');
      }
    },

    showSelectShows({select}) {
      select.hidden = true;
      swm.setSelect(select);
      swm.showSelect();

      if (select.hidden) {
        throw new Error('swm.showSelect() should show the select');
      }
    },

    createOptionsTakesItemsAndReturnsOptions() {
      const items = [{ value: 'a', text: 'Alpha' }, { value: 'b', text: 'Bravo' }, { value: 'c', text: 'Charlie' }];

      const options = swm.createOptions({ items });

      if (!Array.isArray(options)) {
        throw new ErrorWithArgs('swm.createOptions() should return an array', options);
      }

      if (options.length != items.length) {
        throw new ErrorWithArgs('swm.createOptions() should return an array with the same number of items as the input', options.length, items.length);
      }

      for (const option of options) {
        if (option.tagName != 'OPTION') {
          throw new ErrorWithArgs('swm.createOptions() should return an array of option elements', options, option);
        }

        if (!option.value || !option.text) {
          throw new ErrorWithArgs('swm.createOptions() should return an array of option elements with correct value and text properties', options, option, { value: option.value, text: option.text });
        }
      }
    },

    addOptionsThrowsWithoutSelect() {
      reset();

      const options = [new Option(), new Option()]

      try {
        swm.addOptions(options);

        throw null;
      } catch (err) {
        if (!err) {
          throw new Error('swm.addOptions() should throw an error if no select is set');
        }
        if (err.message != 'No select set') {
          throw new ErrorWithArgs('swm.addOptions() should throw an error with the message "No select set"', err);
        }
      }
    },

    addOptionsAppends({select}) {
      const options = [new Option('Alpha', 'a'), new Option('Bravo', 'b')];

      try {
        swm.setSelect(select);
        swm.addOptions(options);

        if (select.children.length != options.length) throw null;
      } catch (err) {
        if (!err) {
          throw new ErrorWithArgs('swm.addOptions() should append all the options to the select', select.children, 'where should be', options);
        }
        throw new ErrorWithArgs('swm.addOptions() should append the options to the select', err);
      }
    },

    addOptionsWithoutArgumentsThrows({select}) {
      try {
        swm.setSelect(select);
        swm.addOptions();

        throw null;
      } catch (err) {
        if (!err) {
          throw new Error('swm.addOptions() should throw an error if no options are passed');
        }
        if (err.message != 'No options passed') {
          throw new ErrorWithArgs('swm.addOptions() should throw an error with the message "No options passed"', err);
        }
      }
    },

    addOptionsWithWrongArgumentThrows({select}) {
      const wrongOptionsArgument = [new Option, document.createElement('div')];

      try {
        swm.setSelect(select);
        swm.addOptions(wrongOptionsArgument);

        throw null;
      } catch (err) {
        if (!err) {
          throw new Error('swm.addOptions() should throw an error if a non-options is passed');
        }

        if (err.message != 'Correct options argument required (iterable with option elements)') {
          throw new ErrorWithArgs('swm.addOptions() should throw an error with the message "Correct options argument required (iterable with option elements)"', err);
        }
      }
    },

    addOptionsWithWrongSecondArgThrows({select}) {
      const options = [new Option];
      const wrongArg1 = {};
      const wrongArg2 = '{}';
      const wrongArg3 = {before: false};
      const wrongArg4 = {before: true, after: true};
      const wrongArg5 = {select: true, hide: true};

      [wrongArg1, wrongArg2, wrongArg3, wrongArg4, wrongArg5].forEach(wrongArg => {
        try {
          swm.setSelect(select);
          swm.addOptions(options, wrongArg);
  
          throw null;

        } catch (err) {
          if (!err) {
            throw new ErrorWithArgs('swm.addOptions() should throw an error if incorrect directives argument is passed', wrongArg);
          }
  
          if (err.message != 'Incorrect directives argument is passed') {
            throw new ErrorWithArgs('swm.addOptions() should throw an error with the message "Incorrect directives argument is passed"', wrongArg, err);
          }
        }
      });
    },

    addOptionsBefore({select}) {
      const oldOptions = [new Option('Alpha', 'a'), new Option('Bravo', 'b'), new Option('Charlie', 'c')];
      const newOptions = [new Option('Delta', 'd'), new Option('Echo', 'e')];
      const expected = newOptions.concat(oldOptions);
      const expectedChildren = vOptions(expected);

      try {
        swm.setSelect(select);
        swm.addOptions(oldOptions);
        swm.addOptions(newOptions, { before: true });

        const children = vOptions(select.children);
        const correct = areCloneLike(children, expectedChildren);
        
        if (!correct) throw null;

      } catch (err) {
        if (!err) {
          throw new ErrorWithArgs('swm.addOptions() should prepend the options to the select', vOptions(select.children), 'where should be', expectedChildren);
        }

        throw new ErrorWithArgs('swm.addOptions() should prepend the options to the select', err);
      }
    },

    addOptionsWithSelectDirective({select}) {
      const oldOptions = [new Option('Alpha', 'a'), new Option('Bravo', 'b'), new Option('Charlie', 'c')];
      const newOptions = [new Option('Delta', 'd'), new Option('Echo', 'e')];
      const expected = 'd';

      try {
        swm.setSelect(select);
        swm.addOptions(oldOptions);
        swm.addOptions(newOptions, { select: true });

        if (select.value != expected) throw null;

      } catch (err) {
        if (!err) {
          throw new ErrorWithArgs('swm.addOptions() should select the first option if the select directive is passed', 'selected', select.value, 'where should be', expected);
        }

        throw new ErrorWithArgs('swm.addOptions() should select the first option if the select directive is passed', err);
      }
    },

    addOptionsWithMarkDirective({select}) {
      const oldOptions = [new Option('Alpha', 'a'), new Option('Bravo', 'b'), new Option('Charlie', 'c')];
      const newOptions = [new Option('Delta', 'd'), new Option('Echo', 'e')];
      const mark = { prefix: '✓ ' };
      const expected = vOptions(newOptions);

      expected[0][1] = mark.prefix + expected[0][1];
      expected[1][1] = mark.prefix + expected[1][1];

      try {
        swm.setSelect(select);
        swm.addOptions(oldOptions);
        swm.setMark(mark);
        swm.addOptions(newOptions, { mark: true });

        const received = vOptions(newOptions);

        if (!areCloneLike(received, expected)) throw null;

      } catch (err) {
        if (!err) {
          throw new ErrorWithArgs('swm.addOptions() should mark the options if the mark directive is passed', vOptions(newOptions), 'where should be', expected);
        }

        throw new ErrorWithArgs('swm.addOptions() should mark the options if the mark directive is passed', err);
      }
    },

    addOptionsWithHideDirective({select}) {
      const options = [new Option('Alpha', 'a'), new Option('Bravo', 'b')];

      try {
        swm.setSelect(select);
        swm.addOptions(options, { hide: true });

        if (options.some(o => !o.hidden)) throw null;

      } catch (err) {
        if (!err) {
          throw new Error('swm.addOptions() should hide the added options if the hide directive is passed');
        }

        throw new ErrorWithArgs('swm.addOptions() should hide the options if the hide directive is passed', err);
      }
    },

    getValueThrowsWithoutSelect() {
      reset();

      try {
        swm.getValue();

        throw null;
      } catch (err) {
        if (!err) {
          throw new Error('swm.getValue() should throw an error if no select is set');
        }
        if (err.message != 'No select set') {
          throw new ErrorWithArgs('swm.getValue() should throw an error with the message "No select set"', err);
        }
      }
    },

    getValueReturnsValue({select}) {
      const options = [new Option('Alpha', 'a'), new Option('Bravo', 'b')];
      const value = options[0].value;

      swm.setSelect(select);
      swm.addOptions(options);

      const result = swm.getValue();

      if (result != value) {
        throw new ErrorWithArgs('swm.getValue() should return the value of the selected option', result, 'where should be', value);
      }
    },

    getMark() {
      const received = swm.getMark();
      const expected = { prefix: '', postfix: '' };

      if (!areCloneLike(received, expected)) {
        throw new ErrorWithArgs('swm.getMark() without prefix and postfix set previously should return', expected, 'but instead got', received);
      }
    },

    setMarkWithoutPrefixAndPostfix() {
      try {
        swm.setMark();

        throw null;

      } catch (err) {
        if (!err) {
          throw new Error('swm.setMark() without prefix and postfix should throw an error');
        }

        if (err.message != 'No prefix or postfix passed') {
          throw new ErrorWithArgs('swm.setMark() without prefix and postfix should throw an error with the message "No prefix or postfix passed"', err);
        }
      }
    },

    setMarkWithPrefixAndPostfixSets() {
      const mark = { prefix: '(', postfix: ')' };
      const expected = { prefix: '(', postfix: ')' };

      try {
        swm.setMark(mark);

        const received = swm.getMark();
        
        if (!areCloneLike(received, expected)) {
          throw null;
        }

      } catch (err) {
        if (!err) {
          throw new ErrorWithArgs('swm.setMark() with prefix and postfix should set the mark to', expected, 'but instead got', swm.getMark());
        }

        throw new ErrorWithArgs('swm.setMark() with prefix and postfix should set the mark', err);
      }
    },

    setMarkWithPrefixOrPostfixSets() {
      const mark1 = { prefix: '(' };
      const mark2 = { postfix: ')' };
      const expected1 = { prefix: '(', postfix: '' };
      const expected2 = { prefix: '(', postfix: ')' };
      let received1, received2;

      try {
        swm.setMark(mark1);
        
        received1 = swm.getMark();

        swm.setMark(mark2);

        received2 = swm.getMark();

        if (!areCloneLike(received1, expected1) || !areCloneLike(received2, expected2)) {
          throw null;
        }

      } catch (err) {
        if (!err) {
          throw new ErrorWithArgs('swm.setMark() with prefix or postfix should set the mark to', expected1, 'and', expected2, 'but instead got', received1, 'and', received2);
        }

        throw new ErrorWithArgs('swm.setMark() with prefix or postfix should set the mark', err);
      }
    },

    markOptionWithoutSelectThrows() {
      try {
        swm.markOption();

        throw null;

      } catch (err) {
        if (!err) {
          throw new Error('swm.markOption() should throw an error if no select is set');
        }

        if (err.message != 'No select set') {
          throw new ErrorWithArgs('swm.markOption() should throw an error with the message "No select set"', err);
        }
      }
    },

    markOptionWithoutOptionsThrows({select}) {
      try {
        swm.setSelect(select);
        swm.markOption();

        throw null;

      } catch (err) {
        if (!err) {
          throw new Error('swm.markOption() should throw an error if select has no options');
        }

        if (err.message != 'Select has no options') {
          throw new ErrorWithArgs('swm.markOption() should throw an error with the message "Select has no options"', err);
        }
      }
    },

    markOptionWithoutMarkDoesNoting({select}) {
      const options = [new Option('Alpha', 'a'), new Option('Bravo', 'b')];
      const expected = vOptions(options);

      swm.setSelect(select);
      swm.addOptions(options);
      swm.markOption();

      const received = vOptions(select.children);

      if (!areCloneLike(received, expected)) {
        throw new ErrorWithArgs('swm.markOption() without mark should do nothing', received, 'where should be', expected);
      }
    },

    markOptionWithMarkMarks({select}) {
      const options = [new Option('Alpha', 'a'), new Option('Bravo', 'b')];
      const mark = { prefix: '✓ ' };
      const expected = vOptions(options)

      expected[0][1] = mark.prefix + expected[0][1];

      swm.setSelect(select);
      swm.addOptions(options);
      swm.setMark(mark);
      swm.markOption(options[0]);

      const received = vOptions(select.children);

      if (!areCloneLike(received, expected)) {
        throw new ErrorWithArgs('swm.markOption() with mark should mark the options', received, 'where should be', expected);
      }
    },

    markOptionWithoutOptionMarksFirstUnmarked({select}) {
      const options = [new Option('Alpha', 'a'), new Option('Bravo', 'b')];
      const mark = { prefix: '✓ ' };
      const expected1 = vOptions(options);
      const expected2 = vOptions(options);

      expected1[0][1] = mark.prefix + expected1[0][1];
      expected2[0][1] = mark.prefix + expected2[0][1];
      expected2[1][1] = mark.prefix + expected2[1][1];

      swm.setSelect(select);
      swm.addOptions(options);
      swm.setMark(mark);
      swm.markOption();

      const received1 = vOptions(select.children);

      swm.markOption();

      const received2 = vOptions(select.children);

      if (!areCloneLike(received1, expected1) || !areCloneLike(received2, expected2)) {
        throw new ErrorWithArgs('swm.markOption() without option should mark the first unmarked option', received1, 'where should be', expected1, 'and', received2, 'where should be', expected2);
      }
    },

    markOptionWithWrongOptionThrows({select}) {
      const wrongOption = document.createElement('div');

      try {
        swm.setSelect(select);
        swm.addOptions([new Option]);
        swm.markOption(wrongOption);

        throw null;

      } catch (err) {
        if (!err) {
          throw new Error('swm.markOption() should throw an error if a non-option is passed');
        }

        if (err.message != 'Correct option argument required (option element)') {
          throw new ErrorWithArgs('swm.markOption() should throw an error with the message "Correct option argument required (option element)"', err);
        }
      }
    },

    unmarkOptionWithoutSelectThrows() {
      try {
        swm.unmarkOption();

        throw null;

      } catch (err) {
        if (!err) {
          throw new Error('swm.unmarkOption() should throw an error if no select is set');
        }

        if (err.message != 'No select set') {
          throw new ErrorWithArgs('swm.unmarkOption() should throw an error with the message "No select set"', err);
        }
      }
    },

    unmarkOptionWithoutOptionsThrows({select}) {
      try {
        swm.setSelect(select);
        swm.unmarkOption();

        throw null;

      } catch (err) {
        if (!err) {
          throw new Error('swm.unmarkOption() should throw an error if select has no options');
        }

        if (err.message != 'Select has no options') {
          throw new ErrorWithArgs('swm.unmarkOption() should throw an error with the message "Select has no options"', err);
        }
      }
    },

    unmarkOptionWithoutOptionUnmarksFirstMarked({select}) {
      const options = [new Option('Alpha', 'a'), new Option('Bravo', 'b')];
      const mark = { prefix: '✓ ' };
      const expected1 = vOptions(options);
      const expected2 = vOptions(options);

      options[0].dataset.text = options[0].text;
      options[0].dataset.mark = true;
      options[0].text = mark.prefix + options[0].text;
      options[1].dataset.text = options[1].text;
      options[1].dataset.mark = true;
      options[1].text = mark.prefix + options[1].text;

      expected1[1][1] = mark.prefix + expected1[1][1];
      
      swm.setSelect(select);
      swm.addOptions(options);
      swm.setMark(mark);
      swm.unmarkOption();

      const received1 = vOptions(select.children);

      swm.unmarkOption();

      const received2 = vOptions(select.children);

      if (!areCloneLike(received1, expected1) || !areCloneLike(received2, expected2)) {
        throw new ErrorWithArgs('swm.unmarkOption() without option should unmark the first marked option', received1, 'where should be', expected1, 'and', received2, 'where should be', expected2);
      }
    },

    unmarkOptionWithOptionUnmarks({select}) {
      const options = [new Option('Alpha', 'a'), new Option('Bravo', 'b')];
      const mark = { prefix: '✓ ' };
      const expected = vOptions(options);

      options[1].dataset.text = options[1].text;
      options[1].dataset.mark = true;
      options[1].text = mark.prefix + options[1].text;

      swm.setSelect(select);
      swm.addOptions(options);
      swm.setMark(mark);
      swm.unmarkOption(options[1]);

      const received = vOptions(select.children);

      if (!areCloneLike(received, expected)) {
        throw new ErrorWithArgs('swm.unmarkOption() with option should unmark the option', received, 'where should be', expected);
      }
    },

    unmarkOptionWithWrongOptionThrows({select}) {
      const wrongOption = document.createElement('div');

      try {
        swm.setSelect(select);
        swm.addOptions([new Option]);
        swm.unmarkOption(wrongOption);

        throw null;

      } catch (err) {
        if (!err) {
          throw new Error('swm.unmarkOption() should throw an error if a non-option is passed');
        }

        if (err.message != 'Correct option argument required (option element)') {
          throw new ErrorWithArgs('swm.unmarkOption() should throw an error with the message "Correct option argument required (option element)"', err);
        }
      }
    },

    removeSelectWithoutSelectThrows() {
      try {
        swm.removeSelect();

        throw null;

      } catch (err) {
        if (!err) {
          throw new Error('swm.removeSelect() should throw an error if no select is set');
        }

        if (err.message != 'No select set') {
          throw new ErrorWithArgs('swm.removeSelect() should throw an error with the message "No select set"', err);
        }
      }
    },

    removeSelectWithSelectRemoves({select}) {
      document.body.append(select);
      
      swm.setSelect(select);
      swm.removeSelect();

      if (select.parentElement) {
        throw new Error('swm.removeSelect() should remove the select');
      }
    },

    replaceSelectWithoutSelectThrows() {
      try {
        swm.replaceSelect();

        throw null;

      } catch (err) {
        if (!err) {
          throw new Error('swm.replaceSelect() should throw an error if no select is set');
        }

        if (err.message != 'No select set') {
          throw new ErrorWithArgs('swm.replaceSelect() should throw an error with the message "No select set"', err);
        }
      }
    },

    replaceSelectWithoutArgsRemoves({select}) {
      document.body.append(select);
      
      swm.setSelect(select);
      swm.replaceSelect();

      if (select.parentElement) {
        throw new Error('swm.replaceSelect() should remove the select');
      }
    },

    replaceSelectWithNodesReplaces({select}) {
      const body = document.body;
      const div = document.createElement('div');
      const span = document.createElement('span');

      body.append(select);
      
      try {
        swm.setSelect(select);
        swm.replaceSelect(div, span);

        if (select.parentElement || body != div.parentElement || body != span.parentElement || div.nextElementSibling != span) {
          throw null;
        }
      } catch (err) {
        if (!err) {
          throw new Error('swm.replaceSelect() should replace the select with the passed nodes');
        }

        throw new ErrorWithArgs('swm.replaceSelect() should replace the select with the nodes', err);
        
      } finally {
        div.remove();
        span.remove();
      }
    },

    placeSelectWithoutSelectThrows() {
      try {
        swm.placeSelect();

        throw null;

      } catch (err) {
        if (!err) {
          throw new Error('swm.placeSelect() should throw an error if no select is set');
        }

        if (err.message != 'No select set') {
          throw new ErrorWithArgs('swm.placeSelect() should throw an error with the message "No select set"', err);
        }
      }
    },

    placeSelectWithoutArgsPlacesInBody({select}) {
      swm.setSelect(select);
      swm.placeSelect();

      if (select.parentElement != document.body) {
        throw new Error('swm.placeSelect() without arguments should place the select in the body');
      }
    },

    placeSelectWithElementPlacesInElement({select}) {
      const div = document.createElement('div');

      swm.setSelect(select);
      swm.placeSelect(div);

      if (select.parentElement != div) {
        throw new Error('swm.placeSelect() with element should place the select in the element');
      }
    },

    placeSelectWithSelectorPlacesInElement({select}) {
      const div1 = document.createElement('div');
      const div2 = document.createElement('div');
      const div3 = document.createElement('div');

      div2.className = 'container';
      div3.className = 'container';

      try {
        document.body.append(div1, div2, div3);
  
        swm.setSelect(select);
        swm.placeSelect('.container');
  
        if (select.parentElement != div2) throw null;
  
        div1.remove();
        div2.remove();
        div3.remove();

      } catch (err) {
        if (!err) {
          throw new Error('swm.placeSelect() with selector should place the select in the first matching element');
        }

        throw new ErrorWithArgs('swm.placeSelect() with selector should place the select in the first matching element', err);

      } finally {
        div1.remove();
        div2.remove();
        div3.remove();
      }
    },

  }  
  
  function setup() {
    const select = document.createElement('select');
    
    return { select };
  }

  function teardown() {
    reset();
  }

  runTests(testSuite, delay, { setup, teardown });
});

function vOptions(options) {
  return [...options].map(o => [o.value, o.text]);
}

/*
  createSelect
  placeSelect (without select, without arguments, with element, with selector)
  removeSelect (without select, with select)
  replaceSelect (without select, without arguments, with nodes)
  getSelect (without select, with select)
  setSelect (without arguments, with select, with null, with wrong argument)
  hideSelect (without select, with select)
  showSelect (without select, with select)
  createOptions (with items)
  addOptions (without select, with options, without options, with wrong options, with wrong directives, with before, with select directive, with mark directive, with hide directive)
  getValue (without select, with options)
  setMark (without prefix and postfix, with one or both)
  getMark (without prefix and postfix, with one or both)
  markOption (without select, without options, without mark, with mark, without option, with option, with wrong option)
  unmarkOption (without select, without options, without option, with option, with wrong option)
*/
