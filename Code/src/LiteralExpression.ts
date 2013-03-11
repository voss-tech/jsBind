/// <reference path="IExpression.ts" />

module jsBind {
    export class LiteralExpression implements IExpression {
        private _value: any;

        constructor(value: any) {
            this._value = value;
        }

        public dispose(): void {
        }

        public eval(changeFunc: any, d: any, p: any, e: any): any {
            return this._value;
        }
    }
}