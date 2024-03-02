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
        setSelect() { },
        createOptions() { },
        addOptions() { },
        getValue() { },
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
      const wrongArg = {};

      try {
        swm.setSelect(select);
        swm.addOptions(options, wrongArg);

        throw null;
      } catch (err) {
        if (!err) {
          throw new Error('swm.addOptions() should throw an error if incorrect directives argument is passed');
        }

        if (err.message != 'Incorrect directives argument is passed') {
          throw new ErrorWithArgs('swm.addOptions() should throw an error with the message "Incorrect directives argument is passed"', err);
        }
      }
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
  }

  runTests(testSuite, delay, { setup, teardown });
});

function vOptions(options) {
  return [...options].map(o => [o.value, o.text]);
}

/*
  setSelect (without arguments, with select, with null, with wrong argument)
  createOptions (with items)
  addOptions (without select, with options, without options, with wrong options)
  getValue (without select, with options)
*/
