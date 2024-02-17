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
  addOptions() { },
  removeOptions() { },
  selectOption() { },
  hideOptions() { },
  showOptions() { },
  markOptions() { },
  unmarkOptions() { },
  setMark() { },
  getMark() { },
};

/* 
  !createSelect()

  createSelect() - creates a select element and returns it
  
  !getSelect()

  getSelect() - returns the сurrent select element
  getSelect() with no current select element - returns null

  !setSelect(select)

  setSelect(select) - sets it as the current select element
  setSelect(null) - forgets the current select element
  setSelect() - throws an error

  !hideSelect()
  !showSelect()

  hideSelect() - hides the current select element
  showSelect() - shows the current select element
  hide/showSelect() with no current select element - throws an error

  !removeSelect()
  !placeSelect(?element | ?selector, ?{before, after, append, prepend, replace, inside})
  !replaceSelect(?...elements)

  remove/replaceSelect() - removes the current select element from the DOM
  placeSelect() - places the current select element at the end of the body
  placeSelect(element) - places the current select element at the end of the element
  placeSelect(selector) - places the current select element at the end of the element found by the selector
  placeSelect(selector, ...) with no element found - throws an error
  placeSelect(element, selector) - throws an error
  placeSelect(element/selector, {directive: !true}) - throws an error
  placeSelect(element/selector, {before: true}) - places the current select element before the element
  placeSelect(element/selector, {after: true}) - places the current select element after the element
  placeSelect(element/selector, {append/inside: true}) - appends the current select element to the element
  placeSelect(element/selector, {prepend: true}) - prepends the current select element to the element
  placeSelect(element/selector, {replace: true}) - replaces the element with the current select element
  placeSelect(element/selector, {replace: true, inside: true}) - replaces the element's content with the current select element
  replaceSelect(...elements) - replaces the current select element in the DOM with the elements
  remove/place/replaceSelect(...) with no current select element - throws an error

  !createOptions(?count, ?!{ dict, values, texts, items, pairs, replace, add, before, after, select, mark, hide })

  createOptions()/(NaPI / NaO) - throws an error, NaPI - not a positive integer, NaO - not an object
  createOptions(PI) - creates and returns the specified number of options
  createOptions({dict: obj}) - creates and returns the options from the dictionary, its keys as values, its values as texts
  createOptions({dict: NaO}) - throws an error
  createOptions({dict/items/entries/values and texts, switch: true}) - creates and returns the options from the arguments, vaues and texts are switched
  createOptions({switch: !true}/{switch without dict/items/entries/values and texts}) - throws an error
  createOptions({values: arr, texts: arr}) - creates and returns the options from the arrays
  createOptions({values: NaA / texts: NaA}/{keys and texts with different lengths}) - throws an error
  createOptions({values / texts}) - creates and returns the options from the array, its items as values and texts
  createOptions({items: [{value, text},...]}) - creates and returns the options from the array of objects
  createOptions({items: NaA} / {items with NaO}) - throws an error
  createOptions({entries: [[value, text],...]}) - creates and returns the options from the array of arrays
  createOptions({entries: NaA} / {entries with NaA}) - throws an error
  createOptions({replace: true}) - replaces the current options with the created ones
  createOptions(...,{..., add: true}) - adds the created options to the current ones
  createOptions(...,{..., add: true, before: true}) - adds the created options before the current ones
  createOptions(...,{..., add: true, after: true}) - adds the created options after the current ones
  createOptions(...,{..., add: true, select: true}) - adds the created options and selects first of them
  createOptions(...,{..., add: true, select: true}) - adds the created options and selects first of them
  createOptions(...,{..., add: true, mark: true}) - adds the created options and marks them
  createOptions(...,{..., add: true, hide: true}) - adds the created options and hides them
  createOptions({replace/add/before/after/select/mark/hide: !true}) - throws an error
  createOptions({before/after without add}) - throws an error
  createOptions({select/mark/hide without replace/add}) - throws an error
  createOptions({replace/add without current select element/without created elements}) - throws an error
  createOptions({before: true, after: true}) - throws an error
  createOptions({select/mark: true, hide: true}) - throws an error
  createOptions({replace: true, add: true}) - throws an error
  
  !getOptions(?{ selected, marked, hidden, value, text, index, all, any})

  getOptions()/({all: true}) - returns all the options
  getOptions({selected: true}) - returns an array with the selected option
  getOptions({selected: false}) - returns all the unselected options
  getOptions({marked: true}) - returns all the marked options
  getOptions({marked: false}) - returns all the unmarked options
  getOptions({hidden: true}) - returns all the hidden options
  getOptions({hidden: false}) - returns all the visible options
  getOptions({marked: true, hidden: true}) - throws an error
  NaF - not a function
  PF - predicate function
  getOptions({value: NaF}) - returns all the options with the specified value as a string
  getOptions({vaue: PF}) - returns all the options satisfying the predicate function with an option value as an argument
  getOptions({text: NaF}) - returns all the options with the specified text as a string
  getOptions({text: PF}) - returns all the options satisfying the predicate function with an option text as an argument
  getOptions({index: NaF}) - returns the option with the specified index as a number
  getOptions({index: PF}) - returns all the options satisfying the predicate function with an option index as an argument
  NaNNI - not a non-negative integer
  getOptions({index: NaNNI}) - throws an error
  getOptions({any combination of selected, marked/hidden, value, text, index}) - returns the options satisfying all the conditions
  getOptions({any combination of selected, marked, hidden, value, text, index with any: true}) - returns the options satisfying any of the conditions
  getOptions({all: true, with any other condition}) - throws an error

  !addOptions(options, ?{ before, after, select, mark, hide })

  addOptions()/({}) - throws an error
  addOptions(options)/(options, {after: true}) - adds the options after the current ones
  addOptions(options, {before: true}) - adds the options before the current ones
  addOptions(options, {select: true}) - adds the options and selects first of them
  addOptions(options, {mark: true}) - adds the options and marks them
  addOptions(options, {hide: true}) - adds the options and hides them
  addOptions(options, {before/after/select/mark/hide: !true}) - throws an error
  addOptions({before: true, after: true}) - throws an error
  addOptions({select/mark: true, hide: true}) - throws an error

  !removeOptions(?options, ?{ selected, marked, hidden, value, text, index, all, any })

  removeOptions()/({all: true}) - removes all the options
  removeOptions(options) - removes the specified options
  removeOptions({selected: true}) - removes the selected option
  removeOptions({selected: false}) - removes all the unselected options
  removeOptions({marked: true}) - removes all the marked options
  removeOptions({marked: false}) - removes all the unmarked options
  removeOptions({hidden: true}) - removes all the hidden options
  removeOptions({hidden: false}) - removes all the visible options
  removeOptions({marked: true, hidden: true}) - throws an error
  removeOptions({value: NaF}) - removes all the options with the specified value as a string
  removeOptions({vaue: PF}) - removes all the options satisfying the predicate function with an option value as an argument
  removeOptions({text: NaF}) - removes all the options with the specified text as a string
  removeOptions({text: PF}) - removes all the options satisfying the predicate function with an option text as an argument
  removeOptions({index: NaF}) - removes the option with the specified index as a number
  removeOptions({index: PF}) - removes all the options satisfying the predicate function with an option index as an argument
  removeOptions({index: NaNNI}) - throws an error
  removeOptions({any combination of selected, marked/hidden, value, text, index}) - removes the options satisfying all the conditions
  removeOptions({any combination of selected, marked, hidden, value, text, index with any: true}) - removes the options satisfying any of the conditions
  removeOptions(options, {any combination of selected, marked, hidden, value, text, index, any}) - same but for provided options only
  removeOptions({all: true, with any other condition}) - throws an error
  removeOptions({any: false}) - throws an error

  !getValues(?options, ?{ selected, marked, hidden, text, index, all, any })

  getValues()/({all: true}) - returns all the values
  getValues({selected: true}) - returns an array with the value of the selected option
  getValues({selected: false}) - returns an array with the values of the unselected options
  getValues({marked: true}) - returns an array with the values of the marked options
  getValues({marked: false}) - returns an array with the values of the unmarked options
  getValues({hidden: true}) - returns an array with the values of the hidden options
  getValues({hidden: false}) - returns an array with the values of the visible options
  getValues({marked: true, hidden: true}) - throws an error
  getValues({text: NaF}) - returns an array with the values of the options with the specified text as a string
  getValues({text: PF}) - returns an array with the values of the options satisfying the predicate function with an option text as an argument
  getValues({index: NaF}) - returns the value of the option with the specified index as a number
  getValues({index: PF}) - returns an array with the values of the options satisfying the predicate function with an option index as an argument
  getValues({index: NaNNI}) - throws an error
  getValues({any combination of selected, marked/hidden, text, index}) - returns the values of the options satisfying all the conditions
  getValues({any combination of selected, marked, hidden, text, index with any: true}) - returns the values of the options satisfying any of the conditions
  getValues(options, {any combination of selected, marked, hidden, text, index, any}) - same but for provided options only
  getValues({all: true, with any other condition}) - throws an error
  getValues({any: false}) - throws an error
  
  !getTexts(?options, ?{ selected, marked, hidden, value, index, all, any })

  getTexts()/({all: true}) - returns all the texts
  getTexts({selected: true}) - returns an array with the text of the selected option
  getTexts({selected: false}) - returns an array with the texts of the unselected options
  getTexts({marked: true}) - returns an array with the texts of the marked options
  getTexts({marked: false}) - returns an array with the texts of the unmarked options
  getTexts({hidden: true}) - returns an array with the texts of the hidden options
  getTexts({hidden: false}) - returns an array with the texts of the visible options
  getTexts({marked: true, hidden: true}) - throws an error
  getTexts({value: NaF}) - returns an array with the texts of the options with the specified value as a string
  getTexts({value: PF}) - returns an array with the texts of the options satisfying the predicate function with an option value as an argument
  getTexts({index: NaF}) - returns the text of the option with the specified index as a number
  getTexts({index: PF}) - returns an array with the texts of the options satisfying the predicate function with an option index as an argument
  getTexts({index: NaNNI}) - throws an error
  getTexts({any combination of selected, marked/hidden, value, index}) - returns the texts of the options satisfying all the conditions
  getTexts({any combination of selected, marked, hidden, value, index with any: true}) - returns the texts of the options satisfying any of the conditions
  getTexts(options, {any combination of selected, marked, hidden, value, index, any}) - same but for provided options only
  getTexts({all: true, with any other condition}) - throws an error
  getTexts({any: false}) - throws an error

  !getIndices(?options, ?{ selected, marked, hidden, value, text, all, any })
  
  getIndices()/({all: true}) - returns all the indices
  getIndices({selected: true}) - returns an array with the index of the selected option
  getIndices({selected: false}) - returns an array with the indices of the unselected options
  getIndices({marked: true}) - returns an array with the indices of the marked options
  getIndices({marked: false}) - returns an array with the indices of the unmarked options
  getIndices({hidden: true}) - returns an array with the indices of the hidden options
  getIndices({hidden: false}) - returns an array with the indices of the visible options
  getIndices({marked: true, hidden: true}) - throws an error
  getIndices({value: NaF}) - returns an array with the indices of the options with the specified value as a string
  getIndices({value: PF}) - returns an array with the indices of the options satisfying the predicate function with an option value as an argument
  getIndices({text: NaF}) - returns an array with the indices of the options with the specified text as a string
  getIndices({text: PF}) - returns an array with the indices of the options satisfying the predicate function with an option text as an argument
  getIndices({any combination of selected, marked/hidden, value, text}) - returns the indices of the options satisfying all the conditions
  getIndices({any combination of selected, marked, hidden, value, text with any: true}) - returns the indices of the options satisfying any of the conditions
  getIndices(options, {any combination of selected, marked, hidden, value, text, any}) - same but for provided options only
  getIndices({all: true, with any other condition}) - throws an error
  getIndices({any: false}) - throws an error

  !markOptions(?options, ?{ selected, value, text, index, all, any })
  
  markOptions()/({all: true}) - marks all the options
  markOptions(options) - marks the specified options
  markOptions({selected: true}) - marks the selected option
  markOptions({selected: false}) - marks all the unselected options
  markOptions({value: NaF}) - marks all the options with the specified value as a string
  markOptions({vaue: PF}) - marks all the options satisfying the predicate function with an option value as an argument
  markOptions({text: NaF}) - marks all the options with the specified text as a string
  markOptions({text: PF}) - marks all the options satisfying the predicate function with an option text as an argument
  markOptions({index: NaF}) - marks the option with the specified index as a number
  markOptions({index: PF}) - marks all the options satisfying the predicate function with an option index as an argument
  markOptions({index: NaNNI}) - throws an error
  markOptions({any combination of selected, value, text, index}) - marks the options satisfying all the conditions
  markOptions({any combination of selected, value, text, index with any: true}) - marks the options satisfying any of the conditions
  markOptions(options, {any combination of selected, value, text, index, any}) - same but for provided options only
  markOptions({all: true, with any other condition}) - throws an error
  markOptions({any: false}) - throws an error

  !unmarkOptions(?options, ?{ selected, value, text, index, all, any })
  
  unmarkOptions()/({all: true}) - unmarks all the options
  unmarkOptions(options) - unmarks the specified options
  unmarkOptions({selected: true}) - unmarks the selected option
  unmarkOptions({selected: false}) - unmarks all the unselected options
  unmarkOptions({value: NaF}) - unmarks all the options with the specified value as a string
  unmarkOptions({vaue: PF}) - unmarks all the options satisfying the predicate function with an option value as an argument
  unmarkOptions({text: NaF}) - unmarks all the options with the specified text as a string
  unmarkOptions({text: PF}) - unmarks all the options satisfying the predicate function with an option text as an argument
  unmarkOptions({index: NaF}) - unmarks the option with the specified index as a number
  unmarkOptions({index: PF}) - unmarks all the options satisfying the predicate function with an option index as an argument
  unmarkOptions({index: NaNNI}) - throws an error
  unmarkOptions({any combination of selected, value, text, index}) - unmarks the options satisfying all the conditions
  unmarkOptions({any combination of selected, value, text, index with any: true}) - unmarks the options satisfying any of the conditions
  unmarkOptions(options, {any combination of selected, value, text, index, any}) - same but for provided options only
  unmarkOptions({all: true, with any other condition}) - throws an error
  unmarkOptions({any: false}) - throws an error

  !hideOptions(?options, ?{ selected, marked, value, text, index, all, any })

  hideOptions()/({all: true}) - hides all the options
  hideOptions(options) - hides the specified options
  hideOptions({selected: true}) - hides the selected option
  hideOptions({selected: false}) - hides all the unselected options
  hideOptions({marked: true}) - hides all the marked options
  hideOptions({marked: false}) - hides all the unmarked options
  hideOptions({value: NaF}) - hides all the options with the specified value as a string
  hideOptions({vaue: PF}) - hides all the options satisfying the predicate function with an option value as an argument
  hideOptions({text: NaF}) - hides all the options with the specified text as a string
  hideOptions({text: PF}) - hides all the options satisfying the predicate function with an option text as an argument
  hideOptions({index: NaF}) - hides the option with the specified index as a number
  hideOptions({index: PF}) - hides all the options satisfying the predicate function with an option index as an argument
  hideOptions({index: NaNNI}) - throws an error
  hideOptions({any combination of selected, marked, value, text, index}) - hides the options satisfying all the conditions
  hideOptions({any combination of selected, marked, value, text, index with any: true}) - hides the options satisfying any of the conditions
  hideOptions(options, {any combination of selected, marked, value, text, index, any}) - same but for provided options only
  hideOptions({all: true, with any other condition}) - throws an error
  hideOptions({any: false}) - throws an error

  !showOptions(?options, ?{ value, text, index, all, any })
  
  showOptions()/({all: true}) - shows all the options
  showOptions(options) - shows the specified options
  showOptions({value: NaF}) - shows all the options with the specified value as a string
  showOptions({vaue: PF}) - shows all the options satisfying the predicate function with an option value as an argument
  showOptions({text: NaF}) - shows all the options with the specified text as a string
  showOptions({text: PF}) - shows all the options satisfying the predicate function with an option text as an argument
  showOptions({index: NaF}) - shows the option with the specified index as a number
  showOptions({index: PF}) - shows all the options satisfying the predicate function with an option index as an argument
  showOptions({index: NaNNI}) - throws an error
  showOptions({any combination of value, text, index}) - shows the options satisfying all the conditions
  showOptions({any combination of value, text, index with any: true}) - shows the options satisfying any of the conditions
  showOptions(options, {any combination of value, text, index, any}) - same but for provided options only
  showOptions({all: true, with any other condition}) - throws an error
  showOptions({any: false}) - throws an error

  !getOption(?{ selected, marked, hidden, value, text, index, any})

  getOption()/(selected: true) - returns the selected option or null
  getOption({selected: false}) - returns the first unselected option or null
  getOption({marked: true}) - returns the first marked option or null
  getOption({marked: false}) - returns the first unmarked option or null
  getOption({hidden: true}) - returns the first hidden option or null
  getOption({hidden: false}) - returns the first visible option or null
  getOption({marked: true, hidden: true}) - throws an error
  getOption({value: NaF}) - returns the option with the specified value as a string, or null
  getOption({vaue: PF}) - returns the first option satisfying the predicate function with an option value as an argument, or null
  getOption({text: NaF}) - returns the option with the specified text as a string, or null
  getOption({text: PF}) - returns the first option satisfying the predicate function with an option text as an argument, or null
  getOption({index: NaF}) - returns the option with the specified index as a number, or null
  getOption({index: PF}) - returns the first option satisfying the predicate function with an option index as an argument, or null
  getOption({index: NaNNI}) - throws an error
  getOption({any combination of selected, marked/hidden, value, text, index}) - returns the option satisfying all the conditions, or null
  getOption({any combination of selected, marked, hidden, value, text, index with any: true}) - returns the option satisfying any of the conditions, or null
  getOption({any: false}) - throws an error

  !selectOption(?option, ?{ value, text, index, hidden, marked })

  selectOption()
  
  addOption(option, ?{ before, after, select, mark, hide })
  removeOption(?option, ?{ selected, marked, hidden, value, text, index})
  getValue(?option, ?{ selected, marked, hidden, text, index })
  getText(?option, ?{ selected, marked, hidden, value, index })
  getIndex(?option, ?{ selected, marked, hidden, value, text })
  markOption(?option, ?{ selected, value, text, index })
  unmarkOption(?option, ?{ selected, value, text, index })
  hideOption(?option, ?{ selected, marked, value, text, index })
  showOption(?option, ?{ value, text, index })
  setMark({prefix, postfix})
  getMark()
*/
