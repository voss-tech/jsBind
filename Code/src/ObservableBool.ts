/// <reference path="Observable.ts"/>

module jsBind {

    /**
     * Implementation of a boolean value that notifies subscribers when its value changes.
     */
    export class ObservableBool extends Observable implements IObservable {
        private _value: bool = false;

	constructor(value: bool = false) {
            super();
            this._value = value;
	}

        /**
         * Gets the bool value.
         */
        public get(): bool {
            return this._value;
        }

        /**
         * Sets the bool value.
         */
        public set(val: bool) {
            if (this._value != val) {
                this._value = val;
                this.notifyChanged("get");
            }
        }

    }
}