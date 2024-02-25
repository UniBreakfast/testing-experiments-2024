export { swm as selectWithMethods, swm as default, swm, reset };

let s;

const swm = {
  setSelect(select) {
    if (!arguments.length) throw new Error('No select passed');

    s = select;
  },

  createOptions({items}) {
    return Array(items.length).fill(document.createElement('option'))
      .map((option, i) => Object.assign(option, { value: items[i].value, textContent: items[i].text }));
  },

  addOptions(options) {
    if (!s) throw new Error('No select set');

    s.append(...options);
  },

  getValue() {
    if (!s) throw new Error('No select set');

    return s.value;
  },
};

function reset() {
  s = undefined;
}
