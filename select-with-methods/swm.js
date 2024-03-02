export { swm as selectWithMethods, swm as default, swm, reset }; // project://select-with-methods/select-with-methods.test.js
let s;

const swm = {
  setSelect(select) {
    if (!(select instanceof HTMLSelectElement) && select !== null) throw new Error('No select passed');

    s = select;
  },

  createOptions({ items }) {
    return Array(items.length).fill(document.createElement('option'))
      .map((option, i) => Object.assign(option, { value: items[i].value, textContent: items[i].text }));
  },

  addOptions(options, directives) {
    if (!s) throw new Error('No select set');

    if (!options) throw Error('No options passed');

    if (typeof options[Symbol.iterator] != 'function' || Array.prototype.some.call(options, o => !(o instanceof Option))) {
      throw new Error('Correct options argument required (iterable with option elements)');
    }

    const dirKeys = ['before', 'after', 'select', 'mark', 'hide'];

    const { before, after, select, mark, hide } = directives || {};

    if (
      arguments.length > 1 && (
        !directives || 
        typeof directives != 'object' || 
        Object.keys(directives).filter(key => dirKeys.includes(key)).length < 1 || 
        dirKeys.some(key => (key in directives) && ![true, 1].includes(directives[key])) || 
        before && after ||
        (select || mark) && hide  
      )) {
      throw new Error('Incorrect directives argument is passed');
    }

    if (before) s.prepend(...options);
    else s.append(...options);

    if (select) s.value = options[0].value;

    if (hide) {
      for (const o of options) o.hidden = true;
    }
  },

  getValue() {
    if (!s) throw new Error('No select set');

    return s.value;
  },
};

function reset() {
  s = undefined;
}
