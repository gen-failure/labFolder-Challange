import {bindable} from 'aurelia-framework';

export class RemoveButton {     
  @bindable showConfirmDialog;
  @bindable suggestFn;
  @bindable deleteFn;
  @bindable itemIndex;

  constructor() {
  }

  onDelete(e) {
    e.stopPropagation();
    this.suggestFn({index : this.itemIndex});
  }
  showConfirmDialogChanged(n) {
    console.log(n);
  }
}
