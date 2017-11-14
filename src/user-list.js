import { observable } from 'aurelia-framework';
import localForage from 'localforage';
import uuid from 'uuid/v1';

class UserList {
  constructor(bindingEngine) {
    this.bindingEngine = bindingEngine;
    this.availableTags = ['Super power','Rich','Genius'];
    this.activeFilters = {};
    this.users = [];
    //Only for initial value, later the class is uploaded directly (not perfect but functional)
    this.rowsVisibility = {};
    this.tableRows = {} ;
    this.newUser = {};

    let filters = [];

    this.availableTags.forEach((tag) => {
      filters[tag] = false;
    });

    this.activeFilters = filters;
    this._createEmptyUserModel();
    this.showConfirmDialog = false
    window.ul = this;
    $(document.body).on('click',(e) => {
        this.showConfirmDialog = false;
    });
  }

  addUser() {
    this.newUser.id = uuid();
    this.users.push(this.newUser);
    this._saveUsers();
    this._createEmptyUserModel();
  }

  suggestDelete(id) {
    console.log(id)
    var i = this.users.findIndex((u) => {return (u.id === id)});
    if (i !== -1) this.showConfirmDialog=id;
  }

  deleteUser(id) {
    var i = this.users.findIndex((u) => {return (u.id === id)});
    if (i !== -1) {
      this.users.splice(i,1);
      this._saveUsers();
    }
  }

  //We could call _saveUSers directly, but let's keep private methods from callbacks
  onUpdate() {
    this._saveUsers();
  }
  
  updateSorting(field, tagName) {
    if (field === this.sortBy && ((field == 'name') || this.sortByTag == tagName)) {
      this.sortOrder = !this.sortOrder;
    } else {
      console.log(field);
      console.log(this.sortBy);
      console.log('---------');
      this.sortOrder = true;
      this.sortBy = field;
      this.sortByTag = tagName
    }
    this._updateHash();
  }

  updateFilters(nf) {
    if (typeof nf === 'object') {
      this.activeFilters = nf;
      this._updateHash();
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
        this.rowsVisibility[user.id] = true;
        $(this.tableRows[user.id]).css('display','table-row');
      } else {
        this.rowsVisibility[user.id] = false;
        $(this.tableRows[user.id]).css('display','none');
        hidden++;
      }
    });
    this.hiddenRows = hidden;
  }

  _updateHash() {
    console.log('updating hash');
    var newHash = 'filter/';
    this.availableTags.forEach((tag) => {
      if (this.activeFilters[tag]) {
        newHash += tag +'/';
      }
    });
    var order = (this.sortOrder) ? 'desc' : 'asc';
    newHash += 'sort/' + order;
    newHash += '/' + this.sortBy;
    if (this.sortByTag) newHash += '/' + this.sortByTag
    
    this.users = this._sortUsers(this.users)
    document.location.hash=newHash;
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
        this.users = this._sortUsers(users);
        this.updateFilters();
      } else {
        this.users = [];
      }
    });
  }

  _sortUsers(users) {
    var sorted = users.sort((a,b) => {
      var res;
      if (this.sortBy == 'name') {
        if (a.name.toLocaleLowerCase() == b.name.toLocaleLowerCase()) return 0;
        if (a.name.toLocaleLowerCase() < b.name.toLocaleLowerCase()) {
          res = 1
        } else  {
          res = -1;
        }
      } else {
        if (a.tags[this.sortByTag] == b.tags[this.sortByTag]) return 0
        if (a.tags[this.sortByTag] < b.tags[this.sortByTag]) {
          res = 1;
        } else {
          res = -1;
        }
      }

      if (!this.sortOrder) res = res*-1;
      return res;
    });
    return sorted;
  }

  // AU Callbacks
  activate(params) {
    console.log('user list activation callback');
    if (params.tags) {
      var tags = params.tags.split('/');
      tags.forEach((tag) => {
        if (this.availableTags.indexOf(tag) !== -1) this.activeFilters[tag] = true;
      });
    }

    if (params.route) {
      var rules = params.route.split('/');

      if (rules[0] == 'desc') {
        this.sortOrder = true;
      } else {
        this.sortOrder = false;
      }
      if (rules[1] == 'tag') {
        this.sortBy = 'tag';
        if (this.availableTags.indexOf(rules[2]) !== -1) {
          this.sortByTag = rules[2]
        } else {
          this.sortByTag = this.availableTags[0];
        }
      } else {
        this.sortBy = 'name'
      }
    }
    this._loadUsers();
  }
  attached() {
  }
}
export default UserList;
