/// <reference path="Observable.ts"/>

module jsBind {

    /**
     * Implementation of an string value that notifies subscribers when its value changes.
     */
    export class ObservableString implements IObservable {
        // Lazy allocated list of delegates.
        private _changeDelegates: ChangeDelegate[];
        private _value: string = null;

        /**
         * Registers a function to call when a member value changes.
         *
         * @param delegate Function that will be invoked when the value changes.
         */
        public addObserver(delegate: ChangeDelegate): void {
            // Null delegates are ignored.
            if (delegate == null) {
                return;
            }

            // Allocate storage if its not been needed until now.
            if (this._changeDelegates == null) {
                this._changeDelegates = [];
            }

            this._changeDelegates.push(delegate);
        }

        /**
         * Unregisters a previously registered change handler.
         *
         * @param delegate Previously registered change handler function.
         */
        public removeObserver(delegate: ChangeDelegate): void {
            var delegates = this._changeDelegates;
            if (delegates == null) {
                return;
            }

            var index = delegates.indexOf(delegate);
            if (index > -1) {
                delegates.splice(index, 1);
            }
        }

        /**
         * Notifies all registered change handlers of a change to the value of a member.
         *
         * @param memberName The name of the member whos value has changed.
         */
        public notifyChanged(memberName: string): void {
            var delegates = this._changeDelegates;
            if (delegates == null) {
                return;
            }

            var len = delegates.length;
            for (var i = 0; i < len; i++) {
                delegates[i](memberName);
            }
        }

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