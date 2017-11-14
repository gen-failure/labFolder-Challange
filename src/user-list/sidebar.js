import {bindable} from 'aurelia-framework';

export class Sidebar {     
  @bindable digest;
  constructor() {
    window.sb = this;
  }
  attached() {
    $(this.toggleLink).sideNav({ edge : 'right' });
  }
}
