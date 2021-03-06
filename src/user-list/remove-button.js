import {bindable} from 'aurelia-framework';

export class RemoveButton {     
  @bindable showConfirmDialog;
  @bindable suggestFn;
  @bindable deleteFn;
  @bindable userId;
  constructor() {
  }

  onDelete(e) {
    e.stopPropagation();
    this.suggestFn({id : this.userId});
  }

  performDelete() {
    this.deleteFn({id : this.userId});
  }
}
