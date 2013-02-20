/// <reference path="Expression.ts" />

module jsBind {

    export class EventBinding {
        private _element: HTMLElement;
        private _eventName: string;
        private _expr: Expression;
        private _dataContext: any;
        private _parentContext: any;

        constructor(element: HTMLElement, eventName: string, expr: Expression, dataContext: any, parentContext: any) {
            this._element = element;
            this._eventName = eventName;
            this._expr = expr;
            this._dataContext = dataContext;
            this._parentContext = parentContext;
            
            if (element.attachEvent) {
                element.attachEvent("on" + eventName, (e) => this.handleEvent(e));
            } else {
                element.addEventListener(eventName, (e) => this.handleEvent(e), false);
            }
        }

        private handleEvent(evt: Event): void {
            this._expr.eval(null, this._dataContext, this._parentContext, evt);
        }

        public dispose() {
            if (this._element.attachEvent) {
                this._element.detachEvent("on" + this._eventName, (e) => this.handleEvent(e));
            } else {
                this._element.removeEventListener(this._eventName, (e) => this.handleEvent(e), false);
            }
        }
    }
}