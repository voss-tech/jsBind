module jsBind {
    /**
     * Describes the method that should be implemented to observe changes in the contents of an observable collection.
     */
    export interface CollectionChangeDelegate {
        (inserted: any[], insertedIndex: number, updated: any[], updatedIndex: number, deleted: any[], deletedIndex: number): void;
    }

    /**
     * Describes the members that should be implemented to add and remove an observer from an observable collection.
     */
    export interface IObservableCollection {
        addCollectionObserver(delegate: CollectionChangeDelegate): void;
        removeCollectionObserver(delegate: CollectionChangeDelegate): void;
    }

    /**
     * An implementation of an observable collection of items.
     */
    export class ObservableCollection implements IObservableCollection {
        private _changeDelegates: CollectionChangeDelegate[];
        private _items: any[];

        /**
         * Intialises a new instance of the ObservableCollection class
         */
        constructor(items: any[] = []) {
            this._items = items;
        }

        /**
         * Gets the value stored at the specified index.
         */
        public get (index: number): any {
            return this._items[index];
        }

        /**
         * Sets the specified value at the specified index into the collection.
         */
        public set (index: number, item: any): void {
            this._items[index] = item;
            this.onCollectionChange([], -1, [item], index, [], -1);
        }

        /**
         * Gets the number of items stored in the collection.
         */
        public count(): number {
            return this._items.length;
        }

        /**
         * Removes the specified item from the collection.
         */
        public remove(item: any): bool {
            var index = this._items.indexOf(item);
            if (index > -1) {
                this._items.splice(index, 1);

                this.onCollectionChange([], -1, [], -1, [item], index);

                return true;
            }

            return false;
        }

        /**
         * Executes a provided function once per collection element.
         */
        public forEach(callbackfn: (value: any, index: number, array: any[]) => void, thisArg: any): void {
            this._items.forEach(callbackfn, thisArg);
        }

        public every(callbackfn: (value: any, index: number, array: any[]) => bool, thisArg: any): bool {
            return this._items.every(callbackfn, thisArg);
        }

        public filter(callbackfn: (value: any, index: number, array: any[]) => bool, thisArg: any): any[] {
            return this._items.filter(callbackfn, thisArg);
        }

        public map(callbackfn: (value: any, index: number, array: any[]) => any, thisArg: any): any[] {
            return this._items.map(callbackfn, thisArg);
        }

        public reduce(callbackfn: (previousValue: any, currentValue: any, currentIndex: number, array: any[]) => any, initialValue: any): any[] {
            return this._items.reduce(callbackfn, initialValue);
        }

        public some(callbackfn: (value: any, index: number, array: any[]) => any, thisArg: any): bool {
            return this._items.some(callbackfn, thisArg);
        }

        /**
         * Search the collection for an element and returns it's position.
         */
        public indexOf(item: any, fromIndex: number = 0): number {
            return this._items.indexOf(item, fromIndex);
        }

        /**
         * Join the elements of the collection into a string.
         */
        public join(seperator: string): string {
            return this._items.join(seperator);
        }

        /**
         * Search the collection for an element, starting at the end, and returns it's position.
         */
        public lastIndexOf(item: any): number {
            return this._items.lastIndexOf(item);
        }

        /**
         * Removes the last element from the collection, and returns it.
         */
        public pop(): any {
            var items = this._items;
            var item = items.pop();

            this.onCollectionChange([], -1, [], -1, [item], items.length);
        }

        /**
         * Adds new elements to the end of the collection, and returns the new length.
         */
        public push(...items: any[]): number {
            var is = this._items;
            var idx = is.length;

            for (var i = 0; i < items.length; i++) {
                is.push(items[i]);
            }

            this.onCollectionChange(items, idx, [], -1, [], -1);

            return this._items.length;
        }

        /**
         * Reverses the order of the elements in the collection.
         */
        public reverse(): void {
            this._items.reverse();

            this.onCollectionChange([], -1, this._items, 0, [], -1);
        }

        /**
         * Removes the first element of the collection, and returns it.
         */
        public shift(): any {
            var item = this._items.shift();

            this.onCollectionChange([], -1, [], -1, [item], 0);

            return item;
        }

        /**
         * Selects a part of a collection, and returns the items as a new array.
         */
        public slice(number: number, end: number): any[] {
            return this._items.slice(number, end);
        }

        /**
         * Sorts the elements of the collection.
         */
        public sort(compareFn: (a: any, b: any) => number): void {
            this._items.sort(compareFn);

            this.onCollectionChange([], -1, this._items, 0, [], -1);
        }

        /**
         * Adds and or removes elements from the collection.  Returns an array of the removed items.
         */
        public splice(start: number, deleteCount: number, ...items: any[]): any[] {
            var is = this._items;

            var removedItems = is.splice(start, deleteCount);

            var idx = start;
            for (var i = 0; i < items.length; i++) {
                is.splice(idx + i, 0, items[i]);
            }

            this.onCollectionChange(items, idx, [], -1, removedItems, start);

            return removedItems;
        }

        /**
         * Converts the collection to a string, and returns the result.
         */
        public toString(): string {
            return this._items.toString();
        }

        // Adds new elements to the beginning of an array, and returns the new length
        /*public unshift(...items:any[]): number {
            var length = this._items.unshift(items);
    
            this.onCollectionChange(items, 0, [], -1, [], -1);
    
            return length;
        }*/



        private onCollectionChange(inserted: any[], insertedIndex: number, updated: any[], updatedIndex: number, deleted: any[], deletedIndex: number): void {
            var delegates = this._changeDelegates;
            if (delegates == null) {
                return;
            }

            var delegatesLen = delegates.length;
            for (var i = 0; i < delegatesLen; i++) {
                delegates[i](inserted, insertedIndex, updated, updatedIndex, deleted, deletedIndex);
            }
        }

        /**
         * Adds an observer function to invoke when the collection changes.
         */
        public addCollectionObserver(delegate: CollectionChangeDelegate): void {
            // Null/undefined delegates are ignored.
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
         * Removes a previously added observer function so that it is no longer invoked when the collection changes.
         */
        public removeCollectionObserver(delegate: CollectionChangeDelegate): void {
            // Ignore if the delegate is null/undefined
            var delegates = this._changeDelegates;
            if (delegates == null) {
                return;
            }

            // Remove the delegate if we can find it.
            var index = delegates.indexOf(delegate);
            if (index > -1) {
                delegates.splice(index, 1);

                // Delete the empty list entirely
                if (delegates.length == 0) {
                    delete this._changeDelegates;
                }
            }
        }
    }
}