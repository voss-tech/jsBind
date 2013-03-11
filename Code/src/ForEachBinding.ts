/// <reference path="IBinding.ts" />
/// <reference path="IExpression.ts"/>
/// <reference path="ObservableCollection.ts"/>
/// <reference path="Binder.ts"/>

module jsBind {
    export class ForEachBinding implements IBinding {
        private _element: HTMLElement;
        private _expression: IExpression;
        private _contentTemplate: Node[] = [];
        private _observable: ObservableCollection;
        private _dataContext: any;
        private _parentContext: any;
        private _binders: Binder[] = [];
        private _handleCollectionChange: (a,b,c,d,e,f) => void;

        constructor(element: HTMLElement, expression: IExpression, dataContext: any, parentContext: any) {
            this._element = element;
            this._expression = expression;
            this._dataContext = dataContext;
            this._parentContext = parentContext;
        }

        public dispose(): void {
            this.clearBinders();

            if (this._expression) {
               this._expression.dispose();
               delete this._expression;
            }
        }

        public evaluate() {

            this._handleCollectionChange = (i, ix, u, ux, d, dx) => this.handleCollectionChange(i, ix, u, ux, d, dx);

            // Take a copy of all the child nodes and store as the template
            var childNodes = this._element.childNodes;
            var len = childNodes.length;
            for (var i = 0; i < len; i++) {
                this._contentTemplate.push(childNodes[i].cloneNode(true));
            }

            // Evaluate the binding
            var changeFunc = (v) => this.handleChange(v);
            var result = this._expression.eval(changeFunc, this._dataContext, this._parentContext, null);

            this.handleChange(result);
        }

        private _prevResult: any;

        private handleChange(result: any): void {
            // Ignore if the value has not really changed
            if (this._prevResult == result) {
                return;
            }

            // Unhook the change notification on any previous value
            if (this._observable) {
                this._observable.removeCollectionObserver(this._handleCollectionChange);
                delete this._observable;
            }

            // Clear any existing items
            this.clearBinders();
            this._element.innerHTML = "";

            // If we have an observable collection hook the change notification
            if (result instanceof ObservableCollection) {
                var observable = <ObservableCollection>result;

                observable.addCollectionObserver(this._handleCollectionChange);
                this._observable = observable;

                // Perform the initial add of all items
                var count = this._observable.count();
                for (var i = 0; i < count; i++) {
                    this.insertItem(this._observable.get(i), i);
                }
            } else if (result instanceof Array) {
                var array = <Array>result;

                var len = array.length;
                for (var i = 0; i < len; i++) {
                    this.insertItem(result[i], i);
                }
            }
        }

        private clearBinders() {
            var binders = this._binders;
            if (binders) {
                var i = binders.length;
                while (i > 0) {
                    binders[--i].dispose();
                }

                this._binders = [];
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
                    this._binders.push(binder);
                } else {
                    var index = i * listCount + j;
                    element.insertBefore(clone, elementChildNodes.item(index));
                    this._binders.splice(index, 0, binder);
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

                var index = i * listCount + j;

                // Unbind the current element
                this._binders[index].dispose();

                // Replace the current element in the visual tree
                this._element.replaceChild(clone, this._element.childNodes.item(index));

                this._binders[index] = binder;
            }
        }

        private deleteItem(i: number) {
            var listCount = this._contentTemplate.length;

            // Delete backwards to maintain the index position in the list and leave fewer items
            // to shuffle up the array each time
            for (var j = listCount - 1; j >= 0; j--) {
                var index = i * listCount + j;        

                // Unbind the element
                this._binders[index].dispose();
                this._binders.splice(index, 1);

                // Remove from the visual tree
                this._element.removeChild(this._element.childNodes.item(index));
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