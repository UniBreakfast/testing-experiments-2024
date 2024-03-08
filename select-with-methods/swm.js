export { swm as selectWithMethods, swm as default, swm, reset }; // project://select-with-methods/select-with-methods.test.js
let s, prefix = '', postfix = '';

const swm = {
  createSelect() {
    return document.createElement('select');
  },

  getSelect() {
    return s || null;
  },

  removeSelect() {
    if (!s) throw new Error('No select set');

    s.remove();
  },

  replaceSelect(...nodes) {
    if (!s) throw new Error('No select set');

    s.replaceWith(...nodes);
  },

  placeSelect(elemOrSelector, directives) {
    if (!s) throw new Error('No select set');

    if (!arguments.length) return document.body.append(s);

    const args = Array.from(arguments);
    
    if (args.some(arg => typeof arg == 'string') && args.some(arg => arg instanceof HTMLElement)) {
      throw new Error('Element or selector expected, not both!');
    }
    
    const elem = elemOrSelector instanceof HTMLElement ? elemOrSelector : document.querySelector(elemOrSelector);
    
    if (!elem) throw new Error('No element found');

    const dirKeys = ['before', 'after', 'prepend', 'append', 'replace', 'inside'];

    const { before, after, prepend, append, replace, inside } = directives || {};

    if (
      arguments.length > 1 && (
        !directives ||
        typeof directives != 'object' ||
        Object.keys(directives).filter(key => dirKeys.includes(key)).length < 1 ||
        dirKeys.some(key => (key in directives) && ![true, 1].includes(directives[key])) ||
        before && after ||
        prepend && append ||
        (before || after) && inside
      )) {
      throw new Error('Incorrect directives argument is passed');
    }

    if (before) elem.before(s);
    else if (after) elem.after(s);
    else if (prepend) elem.prepend(s);
    else if (append || inside && !replace) elem.append(s);
    else if (inside && replace) elem.replaceChildren(s);
    else if (replace) elem.replaceWith(s);
    else elem.append(s);
  },
  
  setSelect(select) {
    if (!(select instanceof HTMLSelectElement) && select !== null) throw new Error('No select passed');

    s = select;
  },

  hideSelect() {
    if (!s) throw new Error('No select set');

    s.hidden = true;
  },

  showSelect() {
    if (!s) throw new Error('No select set');

    s.hidden = false;
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

    if (mark) {
      for (const o of options) {
        o.dataset.text = o.text;
        o.dataset.mark = true;
        o.text = prefix + o.text + postfix;
      }
    }

    if (hide) {
      for (const o of options) o.hidden = true;
    }
  },

  getValue() {
    if (!s) throw new Error('No select set');

    return s.value;
  },

  setMark(mark = {}) {
    if (!mark || !mark.hasOwnProperty('prefix') && !mark.hasOwnProperty('postfix')) {
      throw new Error('No prefix or postfix passed');
    }

    if ('prefix' in mark) prefix = String(mark.prefix);
    if ('postfix' in mark) postfix = String(mark.postfix);
  },

  getMark() {
    return { prefix, postfix };
  },

  markOption(option) {
    if (!s) throw new Error('No select set');

    if (!s.options.length) throw new Error('Select has no options');

    if (option) {
      if (!(option instanceof HTMLOptionElement)) {
        throw new Error('Correct option argument required (option element)');
      }

      if (option.dataset.mark) return;

      option.dataset.text = option.text;
      option.dataset.mark = true;
      option.text = prefix + option.text + postfix;

    } else {
      for (const o of s.options) {
        if (!o.dataset.mark) {
          o.dataset.text = o.text;
          o.dataset.mark = true;
          o.text = prefix + o.text + postfix;
          break;
        }
      }
    }
  },

  unmarkOption(option) {
    if (!s) throw new Error('No select set');

    if (!s.options.length) throw new Error('Select has no options');

    if (option) {
      if (!(option instanceof HTMLOptionElement)) {
        throw new Error('Correct option argument required (option element)');
      }

      if (!option.dataset.mark) return;

      option.text = option.dataset.text;
      delete option.dataset.text;
      delete option.dataset.mark;

    } else {
      for (const o of s.options) {
        if (o.dataset.mark) {
          o.text = o.dataset.text;
          delete o.dataset.text;
          delete o.dataset.mark;
          break;
        }
      }
    }
  },
};

function reset() {
  s?.remove?.();
  s = undefined;
  prefix = '';
  postfix = '';
}
