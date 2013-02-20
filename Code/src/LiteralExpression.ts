/// <reference path="Expression.ts" />

module jsBind {
    export class LiteralExpression extends Expression {
        private _value: any;

        constructor(value: any) {
            super();

            this._value = value;
        }

        public eval(changeFunc: any, d: any, p: any, e: any): any {
            return this._value;
        }
    }
}