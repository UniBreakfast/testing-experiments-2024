import { runTests, ErrorWithArgs, areCloneLike } from '../test.js';

console.log('"swm" means "Select With Methods"');

const delay = 500;

import('./swm.js').then(({ selectWithMethods: swm, reset }) => {
  const testSuite = {
    swmObjectIsImported() {
      if (!swm || typeof swm != 'object') {
        throw complaint(
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
          throw complaint(
            `swm should have a method ${method}().`,
            'instead it looks like this',
            swm,
          );
        }
      }

      for (const key in swm) {
        if (typeof swm[key] == 'function' && !swmBeLike[key]) {
          throw complaint(
            `swm has an unexpected method ${key}().`,
            'unexpected method',
            swm[key],
          );
        }

        if (typeof swm[key] != 'function' && !swmBeLike[key]) {
          throw complaint(
            `swm has an unexpected property ${key}.`,
            `unexpected property swm["${key}"]`,
            swm[key],
          );
        }
      }
    },

    createOptionsTakesItemsAndReturnsOptions() {
      const items = [{ value: 'a', text: 'Alpha' }, { value: 'b', text: 'Bravo' }, { value: 'c', text: 'Charlie' }];

      const options = swm.createOptions({ items });

      reset();

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
      } finally {
        reset();
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
      } finally {
        reset();
      }
    },

    setSelectWithArgumentDoesNotThrow() {
      const select = document.createElement('select');

      try {
        swm.setSelect(select);
      } catch (err) {
        throw new ErrorWithArgs('swm.setSelect() should not throw an error if a select is passed', err);
      } finally {
        reset();
      }
    },

    setSelectSetsSelect() {
      const select = document.createElement('select');
      const options = [new Option(), new Option()]

      swm.setSelect(select);

      try {
        swm.addOptions(options);
      } catch (err) {
        if (err.message == 'No select set') {
          throw new Error('swm.setSelect() should set the select');
        }
      } finally {
        reset();
      }
    },

    addOptionsAppends() {
      const select = document.createElement('select');
      const options = [new Option('a', 'Alpha'), new Option('b', 'Bravo')];

      try {
        swm.setSelect(select);
        swm.addOptions(options);

        if (select.children.length != options.length) throw null;
      } catch (err) {
        if (!err) {
          throw new ErrorWithArgs('swm.addOptions() should append all the options to the select', select.children, 'where should be', options);
        }
        throw new ErrorWithArgs('swm.addOptions() should append the options to the select', err);
      } finally {
        reset();
      }
    },

    getValueThrowsWithoutSelect() {
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
      } finally {
        reset();
      }
    },

    getValueReturnsValue() {
      const select = document.createElement('select');
      const options = [new Option('a', 'Alpha'), new Option('b', 'Bravo')];
      const value = options[0].value;

      swm.setSelect(select);
      swm.addOptions(options);

      const result = swm.getValue();

      reset();
      
      if (result != value) {
        reset();
        throw new ErrorWithArgs('swm.getValue() should return the value of the selected option', result, 'where should be', value);
      }
    },
  }

  runTests(testSuite, delay);
});

/*
  setSelect (without arguments, with select)
  createOptions (with items)
  addOptions (without select, with options)
  getValue (without select, with options)
*/
