import { observable } from 'aurelia-framework';
import localForage from 'localforage';

class UserList {
  constructor(bindingEngine) {
    this.bindingEngine = bindingEngine;
    this.availableTags = ['Super power','Rich','Genius'];
    this.activeFilters = {};
    this.users = [];
    //Only for initial value, later the class is uploaded directly (not perfect but functional) :(
    this.rowsVisibility = [];
    this.tableRows = [] ;
    this.newUser = {};

    let filters = [];

    this.availableTags.forEach((tag) => {
      filters[tag] = false;
    });

    this.activeFilters = filters;
    this._createEmptyUserModel();
    this._loadUsers();
    this.showConfirmDialog = false
    window.ul = this;
    $(document.body).on('click',(e) => {
        this.showConfirmDialog = false;
    });
  }

  addUser() {
    this.users.push(this.newUser);
    this._saveUsers();
    this._createEmptyUserModel();
  }

  suggestDelete(i) {
    this.showConfirmDialog=i;
    console.log('here');
  }

  deleteUser(i) {
    console.log(i);
  }

  //We could call _saveUSers directly, but let's keep private methods from callbacks
  onUpdate() {
    this._saveUsers();
  }

  updateFilters(nf) {
    if (typeof nf === 'object') {
      this.activeFilters = nf;
      var newHash = '';
      this.availableTags.forEach((tag) => {
        if (this.activeFilters[tag]) {
          if (newHash === '') newHash = 'filter/';
          newHash += tag +'/';
        }
      });
      document.location.hash=newHash;
    }
    var hidden = 0;
    this.users.forEach((user,i) => {
      var match = true;
    //We are using old school for loop because we 
      for(let i = 0; i< this.availableTags.length;i++) {
        var tag = this.availableTags[i];
        if (this.activeFilters[tag] && !user.tags[tag]) {
          match = false;
          break;
        }
      }
      if (match) {
        this.rowsVisibility[i] = true;
        $(this.tableRows[i]).css('display','table-row');
      } else {
        this.rowsVisibility[i] = false;
        $(this.tableRows[i]).css('display','none');
        hidden++;
      }
    });
    this.hiddenRows = hidden;
  }

  _createEmptyUserModel() {
    var nu = {name : '', tags : {}}
    this.availableTags.forEach((tag) => {
      nu.tags[tag] = false
    });

    this.newUser = nu;
  }

  _saveUsers() {
    localForage.setItem('lfUsers',this.users, this._loadUsers.bind(this));
  }

  _loadUsers() {
    localForage.getItem('lfUsers').then((users) => {
      if (Array.isArray(users)) {
        this.users = users;
        this.updateFilters();
      } else {
        this.users = [];
      }
    });
  }

  // AU Callbacks
  activate(params) {
    console.log(params);
    if (params.tags) {
      var tags = params.tags.split('/');
      tags.forEach((tag) => {
        if (this.availableTags.indexOf(tag) !== -1) this.activeFilters[tag] = true;
      });
    }
  }
  attached() {
    this.updateFilters();
  }
}
export default UserList;
