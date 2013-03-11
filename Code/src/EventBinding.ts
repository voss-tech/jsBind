/// <reference path="IBinding.ts" />
/// <reference path="IExpression.ts" />

module jsBind {

    export class EventBinding implements IBinding {
        private _element: HTMLElement;
        private _eventName: string;
        private _expr: IExpression;
        private _dataContext: any;
        private _parentContext: any;
        private _handleEvent: (x) => void;

        constructor(element: HTMLElement, eventName: string, expr: IExpression, dataContext: any, parentContext: any) {
            this._element = element;
            this._eventName = eventName;
            this._expr = expr;
            this._dataContext = dataContext;
            this._parentContext = parentContext;
        }

        public evaluate(): void {
            this._handleEvent = (e) => this.handleEvent(e);

            var element = this._element;

            if (element.attachEvent) {
                element.attachEvent("on" + this._eventName, this._handleEvent);
            } else {
                element.addEventListener(this._eventName, this._handleEvent, false);
            }
        }

        public dispose(): void {
            var element = this._element;
            if (element) {
                if (element.detachEvent) {
                    element.detachEvent("on" + this._eventName, this._handleEvent);
                } else {
                    element.removeEventListener(this._eventName, this._handleEvent, false);
                }

                delete this._element;
            }

            if (this._expr) {
                this._expr.dispose();
                delete this._expr;
            }
        }

        private handleEvent(evt: Event): void {
            this._expr.eval(null, this._dataContext, this._parentContext, evt);
        }
    }
}