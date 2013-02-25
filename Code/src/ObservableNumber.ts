/// <reference path="Observable.ts"/>

module jsBind {

    /**
     * Implementation of an numeric value that notifies subscribers when its value changes.
     */
    export class ObservableNumber extends Observable implements IObservable {
        private _value: number = 0;

        /**
         * Gets the numeric value.
         */
        public get(): number {
            return this._value;
        }

        /**
         * Sets the numeric value.
         */
        public set(val: number) {
            if (this._value != val) {
                this._value = val;
                this.notifyChanged("get");
            }
        }

    }
}