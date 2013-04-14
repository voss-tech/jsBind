/*!
 * jsBind Library v1.0.0
 * http://js-bind.com/
 *
 * Copyright 2013 Voss Tech Ltd
 * Released under the MIT license
 * http://js-bind.com/license
 */

// Shim for IE version <= 8
Array.prototype.indexOf = function (obj: any, start?: any): any {
    for (var i = (start || 0), j = this.length; i < j; i++) {
        if (this[i] === obj) { return i; }
    }
    return -1;
}

// Shim for IE version <= 8
Array.prototype.forEach = function (callbackfn: (value: {}, index: number, array: {}[]) => void, that?: any) {
    for (var i = 0, n = this.length; i < n; i++)
        callbackfn.call(that, this[i], i, this);
}

/// <reference path="Observable.ts"/>
/// <reference path="ObservableString.ts"/>
/// <reference path="ObservableNumber.ts"/>
/// <reference path="ObservableBool.ts"/>
/// <reference path="ObservableValue.ts"/>
/// <reference path="ObservableCollection.ts"/>
/// <reference path="Binder.ts" />

module jsBind {

}