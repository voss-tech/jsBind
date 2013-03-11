/// <reference path="IExpression.ts" />
/// <reference path="Binder.ts"/>
/// <reference path="IBinding.ts" />

module jsBind {
    export class TemplateBinding implements IBinding {
        private _element: HTMLElement;
        private _source: string;
        private _expression: IExpression;
        private _dataContext: any;
        private _parentContext: any;

        private _template: any;

        private _binder : Binder;

        constructor(element: HTMLElement, source: string, expression: IExpression, dataContext: any, parentContext: any) {
            this._element = element;
            this._source = source;
            this._expression = expression;
            this._dataContext = dataContext;
            this._parentContext = parentContext;

            if (["id", "url"].indexOf(source) == -1) {
                throw "Unsupported template binding type '" + source + "'";
            }
        }

        public dispose(): void {
            if (this._expression) {
                this._expression.dispose();
                delete this._expression;
            }

            if (this._binder) {
                this._binder.dispose();
                delete this._binder;    
            }
        }

        public evaluate(): void {
            var change = (v) => this.handleChange(v);

            // Execute the binding
            var result = this._expression.eval(change, this._dataContext, this._parentContext, null);

            // Set template
            this.handleChange(result);
        }

        private handleChange(result: any): void {
            // Cleanup any current bindings
            if (this._binder) {
                this._binder.dispose();
            }

            if (this._source == "id") {
                // The result of the binding is the id of an element in the DOM.
                var element = null;

                if (document.getElementById) {
                    // Modern technique
                    element = document.getElementById(result);
                } else if (document.all) {
                    // Older IE
                    element = document.all[result];
                } else if ((<any>document).layers) {
                    // Older FireFox (cast to any because TypeScript doesn't define the layers property in its standard library)
                    element = (<any>document).layers[result];
                }

                if (element) {
                    // Clone the template
                    this._template = element.cloneNode(true);
                }
            } else {
                // The result of the binding is the URL of the template to load
                // ...We need jQuery for this..


            }

            // Make the template the one and only child of the element context
            this._element.innerHTML = "";
            this._element.appendChild(this._template);

            // Apply bindings on the child elements.
            this._binder = new Binder(this._template, this._dataContext, this._parentContext);
        }
    }
}