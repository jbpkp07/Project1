"use strict";
/* global ViewController */

class App {

    constructor() {

        this._viewController = null;
    }

    startApp() {
    
        this._viewController = new ViewController();
    }
}