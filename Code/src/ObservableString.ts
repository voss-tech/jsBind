/// <reference path="Observable.ts"/>

module jsBind {

    /**
     * Implementation of an string value that notifies subscribers when its value changes.
     */
    export class ObservableString extends Observable implements IObservable {
        private _value: string = null;

        /**
         * Gets the string value.
         */
        public get(): string {
            return this._value;
        }

        /**
         * Sets the string value.
         */
        public set(val: string) {
            if (this._value != val) {
                this._value = val;
                this.notifyChanged("get");
            }
        }

    }
}