export { swm as selectWithMethods, swm as default, swm };

import { select } from './select.js';

const swm = {
  getSelect() {
    return select;
  },

  createOptions({ dict, replace }) {
    const allOptions = [];

    if (dict) {
      const entries = Object.entries(dict);
      const options = entries.map(([value, text]) => {
        const option = document.createElement('option');

        Object.assign(option, { value, text });

        return option;
      });

      allOptions.push(...options);
    }

    if (replace) {
      select.replaceChildren(...allOptions);
    }

    return allOptions;
  },

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
