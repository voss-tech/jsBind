/// <reference path="BindingExpression.ts"/>
/// <reference path="ObservableCollection.ts"/>
/// <reference path="Binder.ts"/>

module jsBind {
    export class ForEachBinding {
        private _bindingExpression: BindingExpression;
        private _element: HTMLElement;
        private _contentTemplate: Node[] = [];
        private _observable: ObservableCollection;
        private _dataContext: any;

        constructor(element: HTMLElement, bindingExpression: BindingExpression, dataContext: any, parentContext: any) {
            this._bindingExpression = bindingExpression;
            this._element = element;
            this._dataContext = dataContext;

            // Take a copy of all the child nodes and store as the template
            var childNodes = element.childNodes;
            var len = childNodes.length;
            for (i = 0; i < len; i++) {
                this._contentTemplate.push(childNodes[i].cloneNode(true));
            }

            // Clear the nodes
            element.innerHTML = "";

            // Evaluate the binding
            var result = this._bindingExpression.evaluate(null, dataContext, parentContext, null);

            // If we have an observable collection hook the change notification
            if (result instanceof ObservableCollection) {
                var observable = <ObservableCollection>result;

                observable.addCollectionObserver((i, ix, u, ux, d, dx) => this.handleCollectionChange(i, ix, u, ux, d, dx));
                this._observable = observable;

                // Perform the inital add of all items
                var count = this._observable.count();
                for (var i = 0; i < count; i++) {
                    this.insertItem(this._observable.get(i), i);
                }
            } else if (result instanceof Array) {
                var array = <Array>result;

                len = array.length;
                for (var i = 0; i < len; i++) {
                    this.insertItem(result[i], i);
                }
            }
        }

        private insertItem(dataItem: any, i: number) {
            var element = this._element;
            var elementChildNodes = element.childNodes;
            var contentTemplate = this._contentTemplate;

            var listCount = contentTemplate.length;
            for (var j = 0; j < listCount; j++) {
                // Clone the template
                var clone = contentTemplate[j].cloneNode(true);

                // Bind it
                var binder = new Binder(clone, dataItem, this._dataContext);

                // Append it to the visual tree
                if (i * listCount + j >= elementChildNodes.length) {
                    element.appendChild(clone);
                } else {
                    element.insertBefore(clone, elementChildNodes.item(i * listCount + j));
                }
            }
        }

        private updateItem(dataItem: any, i: number) {
            var listCount = this._contentTemplate.length;
            for (var j = 0; j < listCount; j++) {
                // Clone the template
                var clone = this._contentTemplate[j].cloneNode(true);

                // Bind it
                var binder = new Binder(clone, dataItem, this._dataContext);

                this._element.replaceChild(clone, this._element.childNodes.item(i * listCount + j));
            }
        }

        private deleteItem(i: number) {
            var listCount = this._contentTemplate.length;

            // Delete backwards to maintain the index position in the list and leave fewer items
            // to shuffle up the array each time
            for (var j = listCount - 1; j >= 0; j--) {
                this._element.removeChild(this._element.childNodes.item(i * listCount + j));
            }
        }

        private handleCollectionChange(inserted: any[], insertedIndex: number, updated: any[], updatedIndex: number, deleted: any[], deletedIndex: number): void {

            // Handling deletes first is important.  It keeps us in sync with the indexes.
            var count = deleted.length;
            for (var i = 0; i < count; i++) {
                this.deleteItem(deletedIndex + i);
            }

            count = inserted.length;
            for (var i = 0; i < count; i++) {
                this.insertItem(inserted[i], insertedIndex + i);
            }

            count = updated.length;
            for (var i = 0; i < count; i++) {
                this.updateItem(updated[i], updatedIndex + i);
            }

        }

    }
}