/// <reference path="BindingExpression.ts" />

module jsBind {
    export class TemplateBinding {
        private _source: string;
        private _binding: BindingExpression;
        private _valueExpr: string;
        private _templates: any[];

        constructor(element: HTMLElement, source: string, binding: BindingExpression, dataContext: any, parentContext: any) {
            this._source = source;
            this._binding = binding;
            this._templates = [];

            // Execute the binding
            var result = binding.evaluate(null, dataContext, parentContext, null);

            if (this._source == "id") {
                // The result of the binding is the id of an element in the DOM.
                var element = document.findElementById(result);
                if (element) {
                    this._templates.push(element.cloneNode);
                }
            } else if (this._source == "url") {
                // The result of the binding is the URL of the template to load
                // ...We need jQuery for this..

            } else {
                throw "Unsupported template binding type '" + binding[1] + "'";
            }

            // Hook the change event if there is one
            if (dataContext.addChange) {
                dataContext.addChange((p) => this.handleChange(p));
            }
        }

        private handleChange(p: string) {

        }
    }

}