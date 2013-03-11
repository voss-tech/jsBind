module jsBind {

    /**
     * Interface that defines the methods neccessary for a changes in the values of an
     * objects members to be observed by another object.
     */
    export interface IObservable {
        /**
         * Registers a function to call when a member value changes.
         *
         * @param delegate Function that will be invoked when the value changes.
         */
        addObserver(delegate: ChangeDelegate): void;

        /**
         * Unregisters a previously registered change handler.
         *
         * @param delegate Previously registered change handler function.
         */
        removeObserver(delegate: ChangeDelegate): void;
    }

    /**
     * Defines the type of the delegate function provided to implementations of the
     * IObservable interface for observing changes to the values of another objects
     * members.
     */
    export interface ChangeDelegate {
        (property: string): void;
    }

    /**
     * Implementation of an object that can have changes in the values of its members
     * observed by other objects.  This object is intended to be used as a base class
     * for MVVM model objects.
     */
    export class Observable implements IObservable {
        // Lazy allocated list of delegates.
        private _changeDelegates: ChangeDelegate[];

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
    }
}