/// <reference path="IBinding.ts" />
/// <reference path="IExpression.ts" />
/// <reference path="ObservableString.ts" />

module jsBind {
    export class PropBinding implements IBinding {
        private _element: any;
        private _path: string[];
        private _dataContext: any;
        private _parentContext: any;
        private _expression: IExpression;

        constructor(element: HTMLElement, path: string[], expression: IExpression, dataContext: any, parentContext: any) {
            this._element = element;
            this._path = path;
            this._expression = expression;
            this._dataContext = dataContext;
            this._parentContext = parentContext;
        }

        public dispose(): void {
            if (this._expression) {
                this._expression.dispose();
                delete this._expression;
            }
        }

        public evaluate(): void {
            var change = (v) => this.handleChange(v);

            var result = this._expression.eval(change, this._dataContext, this._parentContext, null);

            // Set the result to the property on the element
            this.handleChange(result);
        }

        private handleChange(result: any): void {
            // Set the result to the property on the element
            var parts = this._path;
            var partsLen = parts.length;
            var obj = this._element;

            if ((partsLen == 2) && (parts[0] === "style")) {
                // To handle css browser prefixes we cycle through the known prefixes until we find
                // a method to invoke
                var part = parts[1];
                
                if (!(part in obj.style)) {
                    var upperName = part.charAt(0).toUpperCase() + part.slice(1);

                    var prefixes = ["webkit", "Moz", "ms", "o"];
                    var i = prefixes.length;
                    while (i-- > 0) {
                        part = prefixes[i] + upperName;
                        if (part in obj.style) {
                            obj.style[part] = result;
                            return;
                        }
                    }
                } else {
                    obj.style[part] = result;
                }
            } else if ((partsLen == 1) && ((parts[0] == "innerText") || (parts[0] == "textContent"))) {
                // Firefox uses textContent instead of innerText.  We map between the two so
                // that both properties work on all browsers
                if (obj.innerText != undefined) {
                    obj.innerText = result;
                } else {
                    obj.textContent = result;
                }
            } else {
                for (var i = 0; i < partsLen - 1; i++) {
                    obj = obj[parts[i]];
                }

                obj[parts[i]] = result;
            }
        }
    }
}