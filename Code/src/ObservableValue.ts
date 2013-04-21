/// <reference path="Observable.ts"/>

module jsBind {

    /**
     * Implementation of an object value that notifies subscribers when its value changes.
     */
    export class ObservableValue extends Observable implements IObservable {
        private _value: any = null;

        constructor(value: any = null) {
            super();

            this._value = value;
        }

        /**
         * Gets the object value.
         */
        public get(): any {
            return this._value;
        }

        /**
         * Sets the object value.
         */
        public set(val: any) {
            if (this._value != val) {
                this._value = val;
                this.notifyChanged("get");
            }
        }

    }
}