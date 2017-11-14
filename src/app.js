import {Router, RouterConfiguration} from 'aurelia-router';
import Materialize from 'materialize-css';

export class App {
  constructor() {
  }

  configureRouter(config,router){
    this.router = router;
    config.title = 'LF Challange app';
    config.options.root = '/';
    config.map([
      { route: '', name : 'basic', moduleId : 'user-list'},
      { route: '/filter/*tags', moduleId : 'user-list' }
    ]);
  }
}
