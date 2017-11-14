import {bindable} from 'aurelia-framework';

export class FilterBox {     
  @bindable filters;
  @bindable updateFn;
  constructor() {
    this.filterCB = {};
    this.filters = {};
    window.fb = this;
  }

  updateFilter(f) {
    var val = $(this.filterCB[f]).prop('checked');
    var nfo = {};
    nfo[f] = val;
    var res = Object.assign(this.filters,nfo);
    this.updateFn({nf : res});
  }

  attached() {
    this._updateCheckboxes();
  }

  _updateCheckboxes() {
    if (typeof this.filters === 'object') {
      Object.keys(this.filters).forEach((filter) => {
        $(this.filterCB[filter]).prop('checked',this.filters[filter]);
      });
    }
  }
}
